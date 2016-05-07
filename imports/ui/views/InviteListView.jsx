export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const InviteListComponent = require("../client/components/Invite/InviteListComponent").default;
      return {
        main: <InviteListComponent />
      };
    }
  },
  fastRender(params) {
    this.subscribe("invites");
  }
};
