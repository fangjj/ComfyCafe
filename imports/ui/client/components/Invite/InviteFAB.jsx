import React from "react";

import "/imports/api/invites/methods";

import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  invite() {
    Meteor.call("addInvite");
  },
  render() {
    return <div id="fabInvite" className="fixed-action-btn">
      <a className="btn-floating btn-large waves-effect waves-light tooltipped"
        data-position="left"
        data-tooltip="Invite someone new :^)"
        onClick={this.invite}
      >
        <Icon>add</Icon>
      </a>
    </div>;
  }
});
