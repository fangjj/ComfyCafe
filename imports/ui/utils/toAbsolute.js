import urljoin from "url-join";

function toAbsolute(path) {
  return urljoin(Meteor.absoluteUrl(), path);
}

export default toAbsolute;
