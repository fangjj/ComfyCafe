import React from "react";
import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

import "/imports/api/messages/methods";
import MessageForm from "./MessageForm";
import Dialog from "/imports/ui/client/components/Dialog";
import Icon from "/imports/ui/client/components/Daikon/Icon";

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
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Message"
        formId={"form" + this.props.message._id}
        open={true}
        onClose={this.hideMessageForm}
      >
        <MessageForm
          id={"form" + this.props.message._id}
          message={this.props.message}
          onClose={this.hideMessageForm}
        />
      </Dialog>;
    }
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
      {this.renderForm()}
    </div>;
  }
});
