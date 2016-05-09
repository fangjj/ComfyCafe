export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const ForgotPassword = require("../client/components/User/ForgotPassword").default;
      return {
        main: <ForgotPassword />
      };
    }
  }
};
