tagStrToUrl = function (tagStr) {
  return encodeURIComponent(tagStr.replace(/ /g, "+")).replace(/%2B/g, "+");
};

tagStrFromUrl = function (tagStr) {
  return decodeURIComponent(tagStr.replace(/\+/g, " "));
};
