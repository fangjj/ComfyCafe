import React from "react";

export default React.createClass({
  delete() {
    Meteor.call("deleteInvite", this.props.invite.key);
  },
  render() {
    return <li>
      <span className="key">{this.props.invite.key}</span>
      <a
        className="deleteInvite material-icons tooltipped"
        data-position="left"
        data-tooltip="Terminate invite?"
        onClick={this.delete}
      >close</a>
    </li>;
  }
});
