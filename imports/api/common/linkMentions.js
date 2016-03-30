import mentionRegex from "/imports/api/common/mentionRegex";

function linkGen(url, label) {
  return '<a href="' + url + '">' + label + '</a>'
};

export default function ($elem) {
  $elem.html($elem.html().replace(mentionRegex, function (match, offset, string) {
    return linkGen(FlowRouter.path("profile", {
      username: match.substr(1)
    }), match);
  }));
};
