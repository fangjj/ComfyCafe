const LoginView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const LoginContainer = require("../client/components/User/LoginContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <LoginContainer />
        }
      };
    }
  }
};

export default LoginView;
