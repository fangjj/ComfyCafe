import urljoin from "url-join";

function toAbsolute(path) {
  if (path.indexOf("://") !== -1) {
    return path;
  }
  return urljoin(Meteor.absoluteUrl(), path);
}

export default toAbsolute;
