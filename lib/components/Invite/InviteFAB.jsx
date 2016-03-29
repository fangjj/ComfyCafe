import React from "react";

InviteFAB = React.createClass({
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
        <i className="material-icons">add</i>
      </a>
    </div>;
  }
});
