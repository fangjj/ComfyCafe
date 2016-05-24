import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import FilterListContainer from "/imports/ui/components/Filter/FilterListContainer";
import FilterContainer from "/imports/ui/components/Filter/FilterContainer";

const filterRoutes = FlowRouter.group({ prefix: "/f" });

filterRoutes.route("/:username", {
  name: "filtersBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Filters");
    render({
      main: <FilterListContainer />
    });
  }
});

filterRoutes.route("/:username/:slug", {
  name: "filter",
  action: function () {
    setTitle(FlowRouter.getParam("slug"));
    render({
      main: <FilterContainer />
    });
  }
});
