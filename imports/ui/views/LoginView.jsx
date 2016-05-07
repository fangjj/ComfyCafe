export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const LoginContainer = require("../client/components/User/LoginContainer").default;
      return {
        main: <LoginContainer />
      };
    }
  }
};
