import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import InviteListComponent from "/imports/ui/components/Invite/InviteListComponent";

const InviteListView = {
  layout: MainLayout,
  content: {
    main: <InviteListComponent />
  }
};

export default InviteListView;
