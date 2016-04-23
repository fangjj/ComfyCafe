import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import AdminView from "/imports/ui/views/AdminView";

const adminRoutes = FlowRouter.group({ prefix: "/admin" });

adminRoutes.route("/", {
  name: "admin",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
  }
});

adminRoutes.route("/:panel", {
  name: "adminPanel",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
  }
});

adminRoutes.route("/:panel/:id", {
  name: "adminView",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
  }
});
