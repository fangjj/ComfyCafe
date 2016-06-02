import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import PageListContainer from "/imports/ui/components/Page/PageListContainer";
import PageContainer from "/imports/ui/components/Page/PageContainer";

const pageRoutes = FlowRouter.group({ prefix: "/p" });

pageRoutes.route("/:username", {
  name: "pagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Pages");
    render({ main: <PageListContainer /> });
  }
});

pageRoutes.route("/:username/:slug", {
  name: "page",
  action: function () {
    setTitle(FlowRouter.getParam("slug"));
    render({ main: <PageContainer /> });
  }
});
