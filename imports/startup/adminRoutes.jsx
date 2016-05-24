import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/api/common/setTitle";

import Admin from "/imports/ui/components/Admin/Admin";

const adminRoutes = FlowRouter.group({ prefix: "/admin" });

adminRoutes.route("/", {
  name: "admin",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <Admin />,
      dense: true
    });
  }
});

adminRoutes.route("/:panel", {
  name: "adminPanel",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <Admin />,
      dense: true
    });
  }
});

adminRoutes.route("/:panel/:id", {
  name: "adminView",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <Admin />,
      dense: true
    });
  }
});
