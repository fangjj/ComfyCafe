import React from "react";

InviteListView = {
  layout: MainLayout,
  content: {
    main: <InviteListComponent />
  },
  fastrender(params) {
    this.subscribe("invites");
  }
};
