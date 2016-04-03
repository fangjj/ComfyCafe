export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const Admin = require("../client/components/Admin/Admin").default;
      return {
        layout: MainLayout,
        content: {
          main: <Admin />
        }
      };
    }
  }
};
