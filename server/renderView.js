renderView = function (route, view) {
  FastRender.route(route, view.fastrender || (() => {}));
};
