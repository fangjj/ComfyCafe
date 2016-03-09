tagQuery = function (str) {
  var parsed = tagParser(str);

  var doc = {};

  _.each(parsed.subjects, function (descriptors, rootNoun) {
    doc["tags.subjects." + rootNoun] = { $exists: true };
  });

  return doc;
};
