import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/api/common/setTitle";

import InviteListComponent from "/imports/ui/components/Invite/InviteListComponent";

FlowRouter.route("/invites/", {
  name: "invites",
  action: function () {
    setTitle("Invites");
    render({ main: <InviteListComponent /> });
  }
});
