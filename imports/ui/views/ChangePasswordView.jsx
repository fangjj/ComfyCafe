export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const ChangePassword = require("../client/components/User/ChangePassword").default;
      return {
        main: <ChangePassword />
      };
    }
  }
};
