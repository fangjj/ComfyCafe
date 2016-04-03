import React from "react";

import "/imports/api/messages/methods";

import MessageUpdateForm from "./MessageUpdateForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

const MessageMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showMessageForm() {
    this.setState({showForm: true});
  },
  hideMessageForm() {
    this.setState({showForm: false});
  },
  delete() {
    Meteor.call("deleteMessage", this.props.message._id);
  },
  render() {
    var msg = this.props.message;

    var owner = msg.owner;
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var moreBtn = <IconButton>
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

export default MessageMoreMenu;
