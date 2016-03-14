tagStringify = function (tagObj) {
  // This currently ignores all negativity.
  var chunks = [];
  _.each(tagObj.subjects, function (descriptors, rootNoun) {
    if (_.isEmpty(descriptors)) {
      chunks.push(rootNoun);
    } else {
      var str = rootNoun + ": ";
      var dChunks = [];
      _.each(descriptors, function (adjs, descNoun) {
        var dStr = "";
        if (adjs.length) {
          dStr += adjs.join(" ") + " ";
        }
        dChunks.push(dStr + descNoun);
      });
      chunks.push(str + dChunks.join(", "));
    }
  });
  return chunks.join("; ");
};
