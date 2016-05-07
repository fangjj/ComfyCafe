export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const FriendList = require("../client/components/User/FriendList").default;
      return {
        main: <FriendList />
      };
    }
  }
};
