const FriendListView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const FriendList = require("../client/components/User/FriendList").default;
      return {
        layout: MainLayout,
        content: {
          main: <FriendList />
        }
      };
    }
  }
};

export default FriendListView;