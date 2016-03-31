import {mount} from "react-mounter";

export default function (view) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);
  } else {
    global.navigator = {
      userAgent: FlowRouter.current()._serverRequest.headers["user-agent"] || "all"
    };
  }
  mount(view.layout, view.content);
};
