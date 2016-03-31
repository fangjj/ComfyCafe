import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import UserSettingsComponent from "/imports/ui/components/User/UserSettingsComponent";

const UserSettingsView = {
  layout: MainLayout,
  content: {
    main: <UserSettingsComponent />
  }
};

export default UserSettingsView;
