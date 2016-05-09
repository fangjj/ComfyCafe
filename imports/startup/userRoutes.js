import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import LoginView from "/imports/ui/views/LoginView";
import ForgotPasswordView from "/imports/ui/views/ForgotPasswordView";
import UserProfileView from "/imports/ui/views/UserProfileView";
import UserSettingsView from "/imports/ui/views/UserSettingsView";
import UserSearchView from "/imports/ui/views/UserSearchView";

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

FlowRouter.route("/forgot-password", {
  name: "forgotPassword",
  action: function () {
    setTitle("Forgot Password");
    renderView(ForgotPasswordView);
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action: function () {
    setTitle("Settings");
    renderView(UserSettingsView);
  }
});

const userRoutes = FlowRouter.group({ prefix: "/u" });

userRoutes.route("/", {
  name: "users",
  action: function () {
    setTitle("Users");
    renderView(UserSearchView);
  }
});

userRoutes.route("/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});
