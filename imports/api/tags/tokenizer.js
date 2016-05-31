import _ from "lodash";

function tagTopLevelTokenizer(str) {
  return _.compact(str.split(/\s*;\s*/));
}

function tagSubjectTokenizer(str) {
  return _.compact(str.split(/\s*:\s*/));
}

function tagDescriptorTokenizer(str) {
  return commaSplit(str);
}

function tagOrTokenizer(str) {
  return _.compact(str.split(/\s+OR\s+|\s*\|\|\s*/i));
}

export {
	tagTopLevelTokenizer,
	tagSubjectTokenizer,
	tagDescriptorTokenizer,
  tagOrTokenizer
};
