import {mount} from "react-mounter";

renderView = function (view) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);
  }
  prettyPrint(view);
  mount(view.layout, view.content);
};
