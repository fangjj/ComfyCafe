function updateQueryStringParameter(uri, key, value) {
  if (! uri) {
    uri = "";
  }

  // by amateur via http://stackoverflow.com/a/6021027/5435443
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    if (typeof value !== "undefined") {
      uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      uri = uri.replace(re, "");
    }
  } else {
    if (typeof value !== "undefined") {
      uri += separator + key + "=" + value;
    }
  }

  if (uri.length) {
    if (uri[0] !== "?") {
      uri = "?" + uri;
    }
  }

  return uri;
}

setQueryParam = function (key, value) {
  if (Meteor.isServer) {
    return;
  }
  return updateQueryStringParameter(
    window.location.search,
    key,
    value
  );
};

setQueryParams = function (queue) {
  if (Meteor.isServer) {
    return;
  }
  
  // FP skills activate!
  return _.reduce(
    _.map(queue, function (obj) {
      return _.toPairs(obj)[0];
    }),
    function (result, value, key) {
      return updateQueryStringParameter(result, value[0], value[1]);
    },
    window.location.search
  );
};
