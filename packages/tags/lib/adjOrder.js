tagAdjOrder = function (oldParsed, newParsed) {
  var adjOrder = {};

  var diff = tagDiffer(oldParsed, newParsed);
  var transmuted = _.reduce(
    diff,
    function (collected, doc, rootNoun) {
      collected[rootNoun] = _.reduce(
        doc.transmuted,
        function (result, val, key) {
          result[key] = val;
          result[val] = key;
          return result;
        },
        {}
      );
      return collected;
    },
    {}
  );

  _.each(newParsed.subjects, function (descriptors, rootNoun) {
    if (! _.has(oldParsed.subjects, rootNoun)) {
      return;
    }

    var innerAdjOrder = {};
    adjOrder[rootNoun] = innerAdjOrder;

    _.each(descriptors, function (dAdjs, descNoun) {
      var search = descNoun;
      if (_.has(transmuted[rootNoun], descNoun)) {
        search = transmuted[rootNoun][descNoun];
      }
      var uAdjs = oldParsed.subjects[rootNoun][search];
      innerAdjOrder[descNoun] = uAdjs;
    });
  });

  return adjOrder;
};
