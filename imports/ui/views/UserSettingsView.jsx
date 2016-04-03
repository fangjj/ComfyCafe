const UserSettingsView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const UserSettingsComponent = require("../client/components/User/UserSettingsComponent").default;
      return {
        layout: MainLayout,
        content: {
          main: <UserSettingsComponent />
        }
      };
    }
  }
};

export default UserSettingsView;
