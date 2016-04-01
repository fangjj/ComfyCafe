import React from "react";

import "/imports/api/tags/methods";

import TagDialog from "./TagDialog";

export default React.createClass({
  handleSubmit(data) {
    Meteor.call("addTag", data, (err, name) => {
      this.props.handleClose();
    });
  },
  render() {
    return <TagDialog
      title="Create Tag"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
    />;
  }
});
