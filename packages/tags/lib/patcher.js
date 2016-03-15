function isRemoved(dDiff, rootNoun, tag) {
  return _.contains(dDiff[rootNoun].removed, tag);
}

function isRemovedFrom(dDiff, rootNoun, tag, adj) {
  return _.has(dDiff[rootNoun].removedFrom, tag)
    && _.contains(dDiff[rootNoun].removedFrom[tag], adj);
}

function isAdded(dDiff, rootNoun, tag) {
  return _.contains(dDiff[rootNoun].added, tag);
}

function isAddedTo(dDiff, rootNoun, tag, adj) {
  return _.has(dDiff[rootNoun].addedTo, tag)
    && _.contains(dDiff[rootNoun].removedFrom[tag], adj);
}

function remove(dTags, rootNoun, tag) {
  delete dTags.subjects[rootNoun][tag];
}

function removeFrom(dTags, rootNoun, tag, adj) {
  if (_.contains(dTags.subjects[rootNoun][tag], adj)) {
    var idx = dTags.subjects[rootNoun][tag].indexOf(adj);
    dTags.subjects[rootNoun][tag].splice(idx, 1);
  }
}

function add(dTags, rootNoun, tag) {
  if (! dTags.subjects[rootNoun][tag]) {
    dTags.subjects[rootNoun][tag] = [];
  }
}

function addTo(dTags, rootNoun, tag, adj) {
  if (! _.contains(dTags.subjects[rootNoun][tag], adj)) {
    dTags.subjects[rootNoun][tag].push(adj);
  }
}

/*
u1: upstream old
u2: upstream new
d: downstream
// simplest scenario
u1 = parse("yoko-littner: long hair")
u2 = parse("yoko-littner: long red hair")
d = parse("yoko-littner: pink hair")
diff(u1, u2) = [
  added long to hair
];
diff(u1, d) = [
  removed red from hair
  added pink to hair
];
output = parse("yoko-littner: long pink hair")
*/
tagPatcher = function (u1, u2, d1, options) {
  if (typeof options === "undefined") {
    options = {};
  }

  var uDiff = tagDiffer(u1, u2, options);
  var xDiff = tagDiffer(u1, d1);

  prettyPrint(uDiff);
  prettyPrint(xDiff);

  var d2 = {
    subjects: JSON.parse(JSON.stringify(d1.subjects)),
    authors: _.clone(d1.authors)
  };

  _.each(d1.subjects, function (descriptors, rootNoun) {
    if (_.has(uDiff, rootNoun)) {
      _.each(uDiff[rootNoun].added, function (tag) {
        if (! isRemoved(xDiff, rootNoun, tag)) {
          add(d2, rootNoun, tag);
        }
      });

      _.each(uDiff[rootNoun].addedTo, function (adjs, tag) {
        if (! isRemoved(xDiff, rootNoun, tag)) {
          _.each(adjs, function (adj) {
            if (! isRemovedFrom(xDiff, rootNoun, tag, adj)) {
              addTo(d2, rootNoun, tag, adj);
            }
          });
        }
      });

      _.each(uDiff[rootNoun].removed, function (tag) {
        if (! isAdded(xDiff, rootNoun, tag)) {
          remove(d2, rootNoun, tag);
        }
      });

      _.each(uDiff[rootNoun].removedFrom, function (adjs, tag) {
        if (! isAdded(xDiff, rootNoun, tag)) {
          _.each(adjs, function (adj) {
            if (! isAddedTo(xDiff, rootNoun, tag, adj)) {
              removeFrom(d2, rootNoun, tag, adj);
            }
          });
        }
      });
    }
  });

  // Don't forget the authors!
  d2.authors.push.apply(d2.authors, u1.authors);
  d2.authors.push.apply(d2.authors, u2.authors);
  d2.authors = _.uniq(d2.authors);

  // Lazy, or genius? Time will decide!
  var tagStr = tagStringify(d2);
  return tagParser(tagStr);
};
