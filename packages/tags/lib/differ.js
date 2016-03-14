tagDiffer = function (oldParsed, newParsed) {
  /*
  o: `long blonde hair`
  n: `short blonde hair`
  intended dOps: ["removed `long` from `hair`", "added `short` to `hair"]
  */

  var diff = {};

  _.each(newParsed.subjects, function (descriptors, rootNoun) {
    var dOps = {
      added: [],
      addedTo: {},
      removed: [],
      removedFrom: {}
    };
    diff[rootNoun] = dOps;

    var uKeys = _.keys(oldParsed.subjects[rootNoun]);
    var dKeys = _.keys(descriptors);
    var dix = _.intersection(uKeys, dKeys);
    _.each(uKeys, function (k) {
      if (! _.contains(dix, k)) {
        dOps.removed.push(k);
      } else {
        _.each(descriptors, function (dAdjs, descNoun) {
          var uAdjs = oldParsed.subjects[rootNoun][descNoun];
          if (uAdjs) {
            var ix = _.intersection(uAdjs, dAdjs);
            _.each(uAdjs, function (a) {
              if (! _.contains(ix, a)) {
                if (! dOps.removedFrom[descNoun]) {
                  dOps.removedFrom[descNoun] = [a];
                } else {
                  dOps.removedFrom[descNoun].push(a);
                }
              }
            });
            _.each(dAdjs, function (a) {
              if (! _.contains(ix, a)) {
                if (! dOps.addedTo[descNoun]) {
                  dOps.addedTo[descNoun] = [a];
                } else {
                  dOps.addedTo[descNoun].push(a);
                }
              }
            });
          }
        });
      }
    });
    _.each(dKeys, function (k) {
      if (! _.contains(dix, k)) {
        dOps.added.push(k);
      }
    });
  });

  prettyPrint(diff);

  return diff;
};
