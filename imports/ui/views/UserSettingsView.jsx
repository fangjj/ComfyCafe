const UserSettingsView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const UserSettingsContainer = require("../client/components/User/UserSettingsContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <UserSettingsContainer />
        }
      };
    }
  }
};

export default UserSettingsView;
