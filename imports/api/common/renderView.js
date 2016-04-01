function renderView(view) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);
    
    const mount = require("react-mounter").mount;
    const built = view.build();
    mount(built.layout, built.content);
  } else {
    FastRender.route(FlowRouter.current().route.pathDef, view.fastRender || (() => {}));
  }
};

export default renderView;
