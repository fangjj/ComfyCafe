const LoginView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const Login = require("../client/components/User/Login").default;
      return {
        layout: MainLayout,
        content: {
          main: <Login />
        }
      };
    }
  }
};

export default LoginView;
