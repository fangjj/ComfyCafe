import {mount} from "react-mounter";

renderView = function (route, view) {
  Session.set("previousPath", Session.get("currentPath") || "/");
  Session.set("currentPath", FlowRouter.current().path);
  mount(view.layout, view.content);
};
