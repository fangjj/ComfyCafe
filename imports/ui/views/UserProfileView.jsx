export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const UserProfile = require("../client/components/User/UserProfile").default;
      return {
        main: <UserProfile />
      };
    }
  },
  fastRender(params) {
    this.subscribe("user", params.username);
  }
};
