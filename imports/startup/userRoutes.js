import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import LoginView from "/imports/ui/views/LoginView";
import UserProfileView from "/imports/ui/views/UserProfileView";
import UserSettingsView from "/imports/ui/views/UserSettingsView";

FlowRouter.route("/login", {
  name: "login",
  action: function () {
    setTitle("Login");
    renderView(LoginView);
  }
});

FlowRouter.route("/register", {
  name: "register",
  action: function () {
    setTitle("Register");
    renderView(LoginView);
  }
});

FlowRouter.route("/u/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action: function () {
    setTitle("Settings");
    renderView(UserSettingsView);
  }
});
