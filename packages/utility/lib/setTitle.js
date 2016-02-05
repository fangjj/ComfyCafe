setTitle = function (title) {
  if (Meteor.isClient) {
    if (! title) {
      title = "TeruImages";
    }
    Session.set("pageTitle", title);
  }
};
