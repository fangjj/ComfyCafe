import React from "react";

import "/imports/api/invites/methods";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconButton
} from "material-ui";

export default React.createClass({
  delete() {
    Meteor.call("deleteInvite", this.props.invite.key);
  },
  render() {
    return <li>
      <span className="key">{this.props.invite.key}</span>
      <IconButton className="deleteInvite" onTouchTap={this.delete}>
        <Icon>close</Icon>
      </IconButton>
    </li>;
  }
});
