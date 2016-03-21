/*
a: [  A  ] [  B  ] [  C  ]
b: [ D ] [ E ] [ F ] [ G ]
c: [D][A][E][B][F][C][G]
*/
arrayMerge = function (a, b) {
  var lookup = {};

  function buildLookup(coll) {
    return function (val) {
      var perc = arrayPercent(coll, val);
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

  var c = [];
  var keyOrder = _.keys(lookup).sort();
  _.each(keyOrder, function (start) {
    var entry = lookup[start];
    var sorted = _.keys(entry).sort();
    _.each(sorted, function (end) {
      c.push.apply(c, entry[end]);
    });
  });

  return _.uniq(c);
};
