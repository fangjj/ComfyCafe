var linkGen = function (url, label) {
  return '<a href="' + url + '">' + label + '</a>'
};

linkMentions = function ($elem) {
  $elem.html($elem.html().replace(mentionRegex, function (match, offset, string) {
    return linkGen(FlowRouter.path("profile", {
      username: match.substr(1)
    }), match);
  }));
};
