tagRenamer = function (oldName, newName, tagDoc) {
  // Thanks to our stringification easymode, we only need to modify the subjects obj.

  if (_.has(tagDoc.subjects, oldName)) {
    tagDoc.subjects[newName] = tagDoc.subjects[oldName];
    delete tagDoc.subjects[oldName];
  } else if (_.has(tagDoc.subjectsReverse, oldName)) {
    _.each(tagDoc.subjectsReverse[oldName], function (adjs, rootNoun) {
      var desc = tagDoc.subjects[rooNoun];
      desc[newName] = desc[oldName];
      delete desc[oldName];
    });
  } else if (_.contains(tagDoc.subjectsFlat, oldName)) {
    // It can only be an adjective at this point.
    _.each(tagDoc.subjects, function (descriptors, rootNoun) {
      _.each(descriptors, function (adjs, descNoun) {
        var idx = adjs.indexOf(oldName);
        adjs[idx] = newName;
      });
    });
  }

  var tagStr = tagStringify(renamed);
  return tagParser(renamed);
};
