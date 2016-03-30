import {mount} from "react-mounter";

export default function (view) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);
  }
  mount(view.layout, view.content);
};
