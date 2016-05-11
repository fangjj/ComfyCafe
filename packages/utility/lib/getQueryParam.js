// via http://stackoverflow.com/a/901144/5435443
getQueryParam = function (name, url) {
  if (Meteor.isServer) {
    return "";
  }
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (! results) return null;
  if (! results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
