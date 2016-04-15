import React from "react";

import "/imports/api/messages/methods";

import MessageUpdateForm from "./MessageUpdateForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showMessageForm() {
    this.setState({ showForm: true });
  },
  hideMessageForm() {
    this.setState({ showForm: false });
  },
  delete() {
    Meteor.call("deleteMessage", this.props.message._id);
  },
  render() {
    const msg = this.props.message;

    const owner = msg.owner;
    const isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    const moreBtn = <IconButton>
      <Icon>more_horiz</Icon>
    </IconButton>;

    return <div className="more">
      <IconMenu
        iconButtonElement={moreBtn}
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        <MenuItem primaryText="Edit" onTouchTap={this.showMessageForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <MessageUpdateForm
        message={msg}
        handleClose={this.hideMessageForm}
        open={this.state.showForm}
      />
    </div>;
  }
});
