Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "TeruImages";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  Cookie.set("X-Auth-Token", Accounts._storedLoginToken());
  injectTapEventPlugin();
});
