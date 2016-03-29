import React from "react";

import PostUpdateForm from "./PostUpdateForm";

import {
  FloatingActionButton,
  FontIcon
} from "material-ui";

const PostModifyFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showPostForm() {
    this.setState({showForm: true});
  },
  hidePostForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showPostForm}>
        <FontIcon className="material-icons">edit</FontIcon>
      </FloatingActionButton>
      <PostUpdateForm
        post={this.props.post}
        handleClose={this.hidePostForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default PostModifyFAB;
