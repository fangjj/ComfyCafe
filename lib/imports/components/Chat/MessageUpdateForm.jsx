import React from "react";

const MessageUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updateMessage", this.props.message._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <MessageDialog
      title="Edit Message"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      message={this.props.message}
    />;
  }
});

export default MessageUpdateForm;
