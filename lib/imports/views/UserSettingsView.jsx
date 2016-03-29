import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import UserSettingsComponent from "/lib/imports/components/User/UserSettingsComponent";

const UserSettingsView = {
  layout: MainLayout,
  content: {
    main: <UserSettingsComponent />
  }
};

export default UserSettingsView;
