const UserProfileView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const UserProfileComponent = require("../client/components/User/UserProfileComponent").default;
      return {
        layout: MainLayout,
        content: {
          main: <UserProfileComponent />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("user", params.username);
  }
};

export default UserProfileView;
