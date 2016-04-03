import React from "react";

import "/imports/api/posts/methods";

import PostDialog from "./PostDialog";

const PostUpdateForm = React.createClass({
  handleSubmit(data) {
    Meteor.call("updatePost", this.props.post._id, data, (err) => {
      this.props.handleClose();
    });
  },
  render() {
    return <PostDialog
      title="Edit Post"
      open={this.props.open}
      modal={false}
      handleClose={this.props.handleClose}
      handleSubmit={this.handleSubmit}
      post={this.props.post}
    />;
  }
});

export default PostUpdateForm;
