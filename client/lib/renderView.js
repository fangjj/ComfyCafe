renderView = function(view) {
  Session.set("previousPath", Session.get("currentPath") || "/");
  Session.set("currentPath", FlowRouter.current().path);
  ReactLayout.render(view.layout, view.content);
};
