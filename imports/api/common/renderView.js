function renderView(view) {
  if (Meteor.isClient) {
    Session.set("previousPath", Session.get("currentPath") || "/");
    Session.set("currentPath", FlowRouter.current().path);

    const LayoutContainer = require("/imports/ui/client/components/Layout/LayoutContainer").default;
    const mount = require("react-mounter").mount;
    const props = view.build();
    mount(LayoutContainer, props);
  } else {
    FastRender.route(FlowRouter.current().route.pathDef, view.fastRender || (() => {}));
  }
};

export default renderView;
