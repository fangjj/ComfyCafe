function tagStrToUrl(tagStr) {
  return encodeURIComponent(tagStr.replace(/ /g, "+")).replace(/%2B/g, "+");
}

function tagStrFromUrl(tagStr) {
  return decodeURIComponent(tagStr.replace(/\+/g, " "));
}

export {
  tagStrToUrl,
  tagStrFromUrl
};
