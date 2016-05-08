export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const UserSearch = require("../client/components/User/UserSearch").default;
      return {
        main: <UserSearch />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allUsers");
  }
};
