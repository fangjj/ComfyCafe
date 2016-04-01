import React from "react";

import "/imports/api/messages/methods";

const MessageForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("addMessage", this.props.topic._id, data, (err, name) => {
      this.props.handleClose();
    });
  },
  render() {
    return <MessageDialog
      title="Create Message"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});

export default MessageForm;
