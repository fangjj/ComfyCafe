import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import InviteListView from "/imports/ui/views/InviteListView";

FlowRouter.route("/invites/", {
  name: "invites",
  action: function () {
    setTitle("Invites");
    renderView(InviteListView);
  }
});
