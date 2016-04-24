import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import PageView from "/imports/ui/views/PageView";
import PageListView from "/imports/ui/views/PageListView";

const pageRoutes = FlowRouter.group({ prefix: "/p" });

pageRoutes.route("/:username", {
  name: "pagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Pages");
    renderView(PageListView);
  }
});

pageRoutes.route("/:username/:slug", {
  name: "page",
  action: function () {
    setTitle(FlowRouter.getParam("slug"));
    renderView(PageView);
  }
});
