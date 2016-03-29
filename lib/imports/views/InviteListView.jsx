import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import InviteListComponent from "/lib/imports/components/Invite/InviteListComponent";

const InviteListView = {
  layout: MainLayout,
  content: {
    main: <InviteListComponent />
  }
};

export default InviteListView;
