Meteor.startup(function(){
  injectTapEventPlugin();
  hotkey.activate();

  emojione.imageType = "svg";
  emojione.imagePathSVG = "/images/emoji/svg/";
});

Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "ComfyCafé";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  Cookie.set("X-Auth-Token", Accounts._storedLoginToken());
});
