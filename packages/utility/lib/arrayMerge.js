/*
a: [  A  ] [  B  ] [  C  ]
b: [ D ] [ E ] [ F ] [ G ]
c: [D][A][E][B][F][C][G]
*/
arrayMerge = function (a, b) {
  const lookup = {};

  function buildLookup(coll) {
    return function (val) {
      const perc = arrayPercent(coll, val);
      if (! _.has(lookup, perc[0])) {
        lookup[perc[0]] = {};
      }
      if (! lookup[perc[0]][perc[1]]) {
        lookup[perc[0]][perc[1]] = [val];
      } else {
        lookup[perc[0]][perc[1]].push(val);
      }
    }
  }

  _.each(a, buildLookup(a));
  _.each(b, buildLookup(b));

  prettyPrint(lookup);

  const c = [];
  const keyOrder = _.keys(lookup).sort();
  _.each(keyOrder, function (start) {
    const entry = lookup[start];
    const sorted = _.keys(entry).sort().reverse();
    _.each(sorted, function (end) {
      c.push.apply(c, entry[end]);
    });
  });

  return _.uniq(c);
};
