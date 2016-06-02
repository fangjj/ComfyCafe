import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import ToggleButton from "/imports/ui/components/Button/ToggleButton";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  block() {
    Meteor.call("blockUser", this.props.user._id);
  },
  unblock() {
    Meteor.call("unblockUser", this.props.user._id);
  },
  render() {
    const blocked = this.context.currentUser
      && _.includes(this.context.currentUser.blocking, this.props.user._id);
    return <ToggleButton
      active={blocked}
      activate={this.block}
      deactivate={this.unblock}
      labelActivate="Block"
      iconActivate="pan_tool"
      labelActivated="Blocked"
      iconActivated="check"
      labelDeactivate="Unblock"
      iconDeactivate="healing"
      width={135}
    />;
  }
});
