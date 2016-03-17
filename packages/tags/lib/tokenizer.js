tagTopLevelTokenizer = function (str) {
  return _.compact(str.split(/\s*;\s*/));
};

tagSubjectTokenizer = function (str) {
  return _.compact(str.split(/\s*:\s*/));
};

tagDescriptorTokenizer = function (str) {
  return _.compact(str.split(/\s*,\s*/))
};
