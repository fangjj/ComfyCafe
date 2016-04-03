const UserProfileView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const UserProfile = require("../client/components/User/UserProfile").default;
      return {
        layout: MainLayout,
        content: {
          main: <UserProfile />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("user", params.username);
  }
};

export default UserProfileView;
