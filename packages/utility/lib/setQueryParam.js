// by amateur via http://stackoverflow.com/a/6021027/5435443
function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    if (typeof value !== "undefined") {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      return uri.replace(re, "");
    }
  } else {
    if (typeof value !== "undefined") {
      return uri + separator + key + "=" + value;
    } else {
      return uri;
    }
  }
}

setQueryParam = function (key, value) {
  var query = updateQueryStringParameter(
    window.location.search,
    key,
    value
  );
  window.history.pushState(FlowRouter.current().context, Session.get("pageTitle"), query);
};
