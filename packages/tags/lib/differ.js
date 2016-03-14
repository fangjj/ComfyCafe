function something(tag) {
  return Tags.findOne({ name: tag });
}

tagDiffer = function (parsed) {
  /*
  u: `long blonde hair`
  d: `short blonde hair`
  intended dOps: ["removed `long` from `hair`", "added `short` to `hair"]
  */

  var dOps = [];

  _.each(parsed.subjects, function (descriptors, rootNoun) {
    var implications = something(rootNoun).implications;
    var uKeys = _.keys(implications.subjects[rootNoun]);
    var dKeys = _.keys(descriptors);
    var dix = _.intersection(uKeys, dKeys);
    _.each(uKeys, function (k) {
      if (! _.contains(dix, k)) {
        dOps.push("removed `" + k + "`");
      } else {
        _.each(descriptors, function (dAdjs, descNoun) {
          var uAdjs = implications.subjects[rootNoun][k];
          var ix = _.intersection(uAdjs, dAdjs);
          _.each(uAdjs, function (a) {
            if (! _.contains(ix, a)) {
              dOps.push("`" + a + "` removed from `" + descNoun + "`");
            }
          });
          _.each(dAdjs, function (a) {
            if (! _.contains(ix, a)) {
              dOps.push("`" + a + "` added to `" + descNoun + "`");
            }
          });
        });
      }
    });
    _.each(dKeys, function (k) {
      if (! _.contains(dix, k)) {
        dOps.push("added `" + k + "`");
      }
    });
  });

  prettyPrint(dOps);

  return dOps;
};
