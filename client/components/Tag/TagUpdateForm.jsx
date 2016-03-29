import React from "react";

TagUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updateTag", this.props.tag._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <TagDialog
      title="Edit Tag"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      tag={this.props.tag}
    />;
  }
});
