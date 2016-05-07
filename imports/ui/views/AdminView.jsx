export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const Admin = require("../client/components/Admin/Admin").default;
      return {
        main: <Admin />,
        dense: true
      };
    }
  }
};
