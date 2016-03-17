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
  var has = _.has(dDiff[rootNoun].addedTo, tag);
  if (! adj) {
    return has;
  } else {
    return has && _.contains(dDiff[rootNoun].removedFrom[tag], adj);
  }
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

function authorPusher(srcs) {
  var authors = [];
  _.each(srcs, function (src) {
    authors.push.apply(authors, src.authors);
  });
  return _.uniq(authors);
}

tagPatcher1 = function (diff, target, authors) {
  var output = {
    subjects: JSON.parse(JSON.stringify(target.subjects)),
    authors: authors || []
  };

  _.each(target.subjects, function (descriptors, rootNoun) {
    if (_.has(diff, rootNoun)) {
      _.each(diff[rootNoun].added, function (tag) {
        add(output, rootNoun, tag);
      });

      _.each(diff[rootNoun].addedTo, function (adjs, tag) {
        _.each(adjs, function (adj) {
          if (! output.subjects[rootNoun][tag]) {
            output.subjects[rootNoun][tag] = [];
          }
          addTo(output, rootNoun, tag, adj);
        });
      });

      _.each(diff[rootNoun].removed, function (tag) {
        remove(output, rootNoun, tag);
      });

      _.each(diff[rootNoun].removedFrom, function (adjs, tag) {
        _.each(adjs, function (adj) {
          removeFrom(output, rootNoun, tag, adj);
        });
      });
    }
  });

  var tagStr = tagStringify(output);
  return tagParser(tagStr);
};

tagPatcher = function (a, b, c) {
  return tagPatcher1(
    tagDiffer(a, b),
    c,
    authorPusher([a, b, c])
  );
};

tagPatcher2 = function (diff, diffPreserve, target, authors) {
  var output = {
    subjects: JSON.parse(JSON.stringify(target.subjects)),
    authors: authors || []
  };

  _.each(target.subjects, function (descriptors, rootNoun) {
    if (_.has(diff, rootNoun)) {
      _.each(diff[rootNoun].added, function (tag) {
        if (! isRemoved(diffPreserve, rootNoun, tag)) {
          add(output, rootNoun, tag);
        }
      });

      _.each(diff[rootNoun].addedTo, function (adjs, tag) {
        if (! isRemoved(diffPreserve, rootNoun, tag)) {
          _.each(adjs, function (adj) {
            if (! isRemovedFrom(diffPreserve, rootNoun, tag, adj)) {
              addTo(output, rootNoun, tag, adj);
            }
          });
        }
      });

      _.each(diff[rootNoun].removed, function (tag) {
        if (
          ! isAdded(diffPreserve, rootNoun, tag)
          && ! isAddedTo(diffPreserve, rootNoun, tag)
        ) {
          remove(output, rootNoun, tag);
        }
      });

      _.each(diff[rootNoun].removedFrom, function (adjs, tag) {
        if (! isAdded(diffPreserve, rootNoun, tag)) {
          _.each(adjs, function (adj) {
            if (! isAddedTo(diffPreserve, rootNoun, tag, adj)) {
              removeFrom(output, rootNoun, tag, adj);
            }
          });
        }
      });
    }
  });

  // Lazy, or genius? Time will decide!
  var tagStr = tagStringify(output);
  return tagParser(tagStr);
};

tagPatcherSyncImpl = function (u1, u2, d1) {
  var diff = tagDiffer(u1, u2);
  var diffPreserve = tagDiffer(u1, d1);

  console.log("[tagPatcherSyncImpl]");
  prettyPrint(diff);
  prettyPrint(diffPreserve);

  return tagPatcher2(
    diff,
    diffPreserve,
    d1,
    authorPusher([d1, u1, u2])
  );
};

/*
1. diff u1 and u2
2. diff ui and d1
3. deep clone d1 to d2
4. apply u1->u2 diff to d2 if the change isn't countered by u1->d1 diff

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
