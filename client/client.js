import hotkey from "react-hotkey";
import injectTapEventPlugin from "react-tap-event-plugin";
import emojione from "emojione";
import marked from "marked";

Meteor.startup(function(){
  injectTapEventPlugin();
  hotkey.activate();

  emojione.imageType = "svg";
  emojione.imagePathSVG = "/images/emoji/svg/";

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });
});

Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "ComfyCafé";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  Cookie.set("X-Auth-Token", Accounts._storedLoginToken());
});
