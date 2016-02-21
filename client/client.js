Meteor.startup(function(){
  injectTapEventPlugin();
  hotkey.activate();
});

Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "ComfyCafé";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  Cookie.set("X-Auth-Token", Accounts._storedLoginToken());
});
