export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const UserSettingsContainer = require("../client/components/User/UserSettingsContainer").default;
      return {
        main: <UserSettingsContainer />
      };
    }
  }
};
