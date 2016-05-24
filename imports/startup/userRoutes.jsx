import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import LoginContainer from "/imports/ui/components/User/LoginContainer";
import ChangePassword from "/imports/ui/components/User/ChangePassword";
import ForgotPassword from "/imports/ui/components/User/ForgotPassword";
import UserSettingsContainer from "/imports/ui/components/User/UserSettingsContainer";
import UserProfile from "/imports/ui/components/User/UserProfile";
import UserSearch from "/imports/ui/components/User/UserSearch";

FlowRouter.route("/login", {
  name: "login",
  action: function () {
    setTitle("Login");
    render({ main: <LoginContainer /> });
  }
});

FlowRouter.route("/register", {
  name: "register",
  action: function () {
    setTitle("Register");
    render({ main: <LoginContainer /> });
  }
});

FlowRouter.route("/change-password", {
  name: "changePassword",
  action: function () {
    setTitle("Change Password");
    render({ main: <ChangePassword /> });
  }
});

FlowRouter.route("/forgot-password", {
  name: "forgotPassword",
  action: function () {
    setTitle("Forgot Password");
    render({ main: <ForgotPassword /> });
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action: function () {
    setTitle("Settings");
    render({ main: <UserSettingsContainer /> });
  }
});

const userRoutes = FlowRouter.group({ prefix: "/u" });

userRoutes.route("/", {
  name: "users",
  action: function () {
    setTitle("Users");
    render({ main: <UserSearch /> });
  }
});

userRoutes.route("/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    render({ main: <UserProfile /> });
  }
});
