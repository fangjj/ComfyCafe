import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import FilterView from "/imports/ui/views/FilterView";
import FilterListView from "/imports/ui/views/FilterListView";

const filterRoutes = FlowRouter.group({ prefix: "/f" });

filterRoutes.route("/:username", {
  name: "filtersBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Filters");
    renderView(FilterListView);
  }
});

filterRoutes.route("/:username/:slug", {
  name: "filter",
  action: function () {
    setTitle(FlowRouter.getParam("slug"));
    renderView(FilterView);
  }
});
