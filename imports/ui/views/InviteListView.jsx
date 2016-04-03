const InviteListView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const InviteListComponent = require("../client/components/Invite/InviteListComponent").default;
      return {
        layout: MainLayout,
        content: {
          main: <InviteListComponent />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("invites");
  }
};

export default InviteListView;
