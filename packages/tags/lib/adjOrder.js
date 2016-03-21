tagAdjOrder = function (oldParsed, newParsed) {
  var diff = {};

  _.each(newParsed.subjects, function (descriptors, rootNoun) {
    if (! _.has(oldParsed.subjects, rootNoun)) {
      return;
    }

    var adjOrder = {};
    diff[rootNoun] = adjOrder;

    _.each(descriptors, function (dAdjs, descNoun) {
      var uAdjs = oldParsed.subjects[rootNoun][descNoun];
      adjOrder[descNoun] = uAdjs;
    });
  });

  return diff;
};
