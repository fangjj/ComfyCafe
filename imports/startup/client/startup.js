import hotkey from "react-hotkey";
import injectTapEventPlugin from "react-tap-event-plugin";
import emojione from "emojione";
import marked from "marked";
import "blueimp-canvas-to-blob";

import "/imports/startup/client/accounts";

Meteor.startup(function () {
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
});

Tracker.autorun(function () {
  Cookie.set("X-Auth-Token", Accounts._storedLoginToken());
});

Tracker.autorun(function (c) {
  try {
    UserStatus.startMonitor({
      threshold: 30000,
      interval: 10000,
      idleOnBlur: false
    });
    c.stop();
  } catch (e) {}
});
