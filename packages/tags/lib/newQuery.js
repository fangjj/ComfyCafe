tagQuery = function (str) {
  var parsed = parseTagStr(str);

  var doc = {};

  _.each(parsed.subjects, function (descriptors, rootNoun) {
    doc["tags.subjects." + rootNoun] = { $exists: true };
  });

  return doc;
};
