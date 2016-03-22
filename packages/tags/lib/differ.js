/*
o: `long blonde hair`
n: `short blonde hair`
intended dOps: ["removed `long` from `hair`", "added `short` to `hair"]
*/

tagDiffer = function (oldParsed, newParsed) {
  var diff = {};

  var extLookup = _.reduce(
    _.union(oldParsed.allTags, newParsed.allTags),
    function (result, tag) {
      result[tag] = tagExtensions(tag);
      return result;
    },
    {}
  );

  _.each(newParsed.subjects, function (descriptors, rootNoun) {
    var rootExts = extLookup[rootNoun];
    prettyPrint(rootExts, _.keys(oldParsed.subjects), extLookup);
    var oldRootIntersection = _.intersection(
      _.keys(oldParsed.subjects), rootExts
    );

    if (! oldRootIntersection.length) {
      return;
    }

    if (oldRootIntersection[0] !== rootNoun) {
      oldParsed.subjects[rootNoun] = oldParsed.subjects[oldRootIntersection[0]];
      delete oldParsed.subjects[oldRootIntersection[0]];
    }

    var dOps = {
      added: [],
      addedTo: {},
      removed: [],
      removedFrom: {},
      transmuted: {}
    };
    diff[rootNoun] = dOps;

    var transmutationCandidates = {};

    var uKeys = _.keys(oldParsed.subjects[rootNoun]);
    var dKeys = _.keys(descriptors);
    var dix = _.intersection(uKeys, dKeys);
    _.each(uKeys, function (k) {
      if (! _.includes(dix, k)) {
        dOps.removed.push(k);

        // This is now a transmutation candidate!
        var exts = extLookup[k];
        var xix = _.intersection(exts, dKeys);
        _.each(xix, function (x) {
          transmutationCandidates[x] = {
            upstream: k,
            exts: exts
          };
        });
      }
    });
    _.each(dKeys, function (k) {
      if (! _.includes(dix, k)) {
        if (_.has(transmutationCandidates, k)) {
          // Transmuted from upstream
          var trans = transmutationCandidates[k];
          dOps.transmuted[trans.upstream] = k;
          dOps.removed = _.without(dOps.removed, trans.upstream);
          descriptors[trans.upstream] = descriptors[k];
          delete descriptors[k];
        } else {
          // Check if transmuted from downstream
          var exts = extLookup[k];
          var xix = _.intersection(exts, uKeys);
          if (xix.length) {
            // Transmutation has occurred!
            dOps.transmuted[xix[0]] = k;
            dOps.removed = _.without(dOps.removed, xix[0]);
            oldParsed.subjects[rootNoun][k] = oldParsed.subjects[rootNoun][xix[0]];
            delete oldParsed.subjects[rootNoun][xix[0]];
          } else {
            // Things are perfectly normal
            dOps.added.push(k);
          }
        }
      }
    });

    _.each(descriptors, function (dAdjs, descNoun) {
      var uAdjs = oldParsed.subjects[rootNoun][descNoun];
      if (uAdjs) {
        var ix = _.intersection(uAdjs, dAdjs);
        _.each(uAdjs, function (a) {
          if (! _.includes(ix, a)) {
            if (! dOps.removedFrom[descNoun]) {
              dOps.removedFrom[descNoun] = [a];
            } else {
              dOps.removedFrom[descNoun].push(a);
            }
          }
        });
        _.each(dAdjs, function (a) {
          if (! _.includes(ix, a)) {
            if (! dOps.addedTo[descNoun]) {
              dOps.addedTo[descNoun] = [a];
            } else {
              dOps.addedTo[descNoun].push(a);
            }
          }
        });
      } else {
        if (! dOps.addedTo[descNoun]) {
          dOps.addedTo[descNoun] = dAdjs;
        } else {
          dOps.addedTo[descNoun].push.apply(dOps.addedTo[descNoun], dAdjs);
        }
      }
    });
  });

  return diff;
};
