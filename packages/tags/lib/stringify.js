tagStringify = function (tagObj) {
  // This currently ignores all negativity.
  var chunks = [];
  _.each(tagObj.authors, function (author) {
    chunks.push("by " + author);
  });
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

tagChunkStringify = function (tagObj, rootNoun, exclude) {
  if (! exclude) {
    exclude = [];
  }
  var str = "";
  if (_.has(tagObj.subjects, rootNoun)) {
    if (! _.isEmpty(tagObj.subjects[rootNoun])) {
      var dChunks = [];
      _.each(tagObj.subjects[rootNoun], function (adjs, descNoun) {
        if (! _.contains(exclude, descNoun)) {
          var dStr = "";
          if (adjs.length) {
            dStr += adjs.join(" ") + " ";
          }
          dChunks.push(dStr + descNoun);
        }
      });
      str = dChunks.join(", ");
    }
  }
  return str;
};
