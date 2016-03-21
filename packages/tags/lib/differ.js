/*
o: `long blonde hair`
n: `short blonde hair`
intended dOps: ["removed `long` from `hair`", "added `short` to `hair"]
*/

tagDiffer = function (oldParsed, newParsed) {
  var diff = {};

  _.each(newParsed.subjects, function (descriptors, rootNoun) {
    if (! _.has(oldParsed.subjects, rootNoun)) {
      return;
    }

    var dOps = {
      added: [],
      addedTo: {},
      removed: [],
      removedFrom: {},
      adjOrder: {}
    };
    diff[rootNoun] = dOps;

    var uKeys = _.keys(oldParsed.subjects[rootNoun]);
    var dKeys = _.keys(descriptors);
    var dix = _.intersection(uKeys, dKeys);
    _.each(uKeys, function (k) {
      if (! _.includes(dix, k)) {
        dOps.removed.push(k);
      }
    });
    _.each(dKeys, function (k) {
      if (! _.includes(dix, k)) {
        dOps.added.push(k);
      }
    });

    _.each(descriptors, function (dAdjs, descNoun) {
      var removedAdjs = [];

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
            removedAdjs.push(a);
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

      dOps.adjOrder[descNoun] = _.difference(uAdjs, removedAdjs);
    });
  });

  return diff;
};
