import { DocHead } from "meteor/kadira:dochead";

setTitle = function (title) {
  if (! title) {
    title = "ComfyCafé";
  }
  if (Meteor.isClient) {
    Session.set("pageTitle", title);
  } else {
    DocHead.setTitle(title);
  }
};
