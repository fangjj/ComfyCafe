function isRemoved(dDiff, rootNoun, tag) {
  return _.includes(dDiff[rootNoun].removed, tag);
}

function isRemovedFrom(dDiff, rootNoun, tag, adj) {
  return _.has(dDiff[rootNoun].removedFrom, tag)
    && _.includes(dDiff[rootNoun].removedFrom[tag], adj);
}

function isAdded(dDiff, rootNoun, tag) {
  return _.includes(dDiff[rootNoun].added, tag);
}

function isAddedTo(dDiff, rootNoun, tag, adj) {
  var has = _.has(dDiff[rootNoun].addedTo, tag);
  if (! adj) {
    return has;
  } else {
    return has && _.includes(dDiff[rootNoun].removedFrom[tag], adj);
  }
}

function remove(dTags, rootNoun, tag) {
  delete dTags.subjects[rootNoun][tag];
}

function removeFrom(dTags, rootNoun, tag, adj) {
  if (_.includes(dTags.subjects[rootNoun][tag], adj)) {
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
  if (! _.includes(dTags.subjects[rootNoun][tag], adj)) {
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

tagPatcherDirect = function (diff, diffPreserve, target, authors) {
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

tagPatcher = function (a, b, c) {
  return tagPatcherDirect(
    tagDiffer(a, b),
    tagDiffer(a, c),
    c,
    authorPusher([a, b, c])
  );
};
