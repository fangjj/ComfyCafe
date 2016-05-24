import React from "react";

import "/imports/api/invites/methods";
import FAB from "/imports/ui/components/FAB";

export default React.createClass({
  invite() {
    Meteor.call("addInvite");
  },
  render() {
    return <FAB iconName="add" onTouchTap={this.invite} />;
  }
});
