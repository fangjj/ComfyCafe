import React from "react";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/messages/methods";
import MoreMenu from "/imports/ui/client/components/MoreMenu";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  delete() {
    Meteor.call("deleteMessage", this.props.message._id);
  },
  render() {
    const msg = this.props.message;

    const owner = msg.owner;
    const isOwner = this.context.currentUser && this.context.currentUser._id === owner._id;

    if (! isOwner) {
      return null;
    }

    return <MoreMenu>
      <MenuItem primaryText="Edit" onTouchTap={this.props.onEdit} />
      <MenuItem primaryText="Delete" onTouchTap={this.delete} />
    </MoreMenu>;
  }
});
