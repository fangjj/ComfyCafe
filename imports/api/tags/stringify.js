import _ from "lodash";

import safetyLabels from "/imports/api/common/safetyLabels";

function tagStringify(tagObj) {
  // This currently ignores all negativity.
  var chunks = [];

  _.each(tagObj.authors, function (author) {
    chunks.push("by " + author);
  });
  _.each(tagObj.origins, function (origin) {
    chunks.push("from " + origin);
  });

  const safety = _.reduce(
    tagObj.safeties,
    function (result, s, i) {
      if (i > 1) {
        prev = result[i-1];
        twoAgo = result[i-2];
        if (twoAgo == prev - 1 && twoAgo == s - 2) {
          const x = result.splice(i-1, 1);
        }
      }
      result.push(safetyLabels[s].toLowerCase());
      return result;
    },
    []
  );
  if (safety.length) {
    chunks.push("safety " + safety.join("-"));
  }

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
}

function tagChunkStringify(tagObj, rootNoun, exclude) {
  if (! exclude) {
    exclude = [];
  }
  var str = "";
  if (_.has(tagObj.subjects, rootNoun)) {
    if (! _.isEmpty(tagObj.subjects[rootNoun])) {
      var dChunks = [];
      _.each(tagObj.subjects[rootNoun], function (adjs, descNoun) {
        if (! _.includes(exclude, descNoun)) {
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
}

export {
  tagStringify,
  tagChunkStringify
};
