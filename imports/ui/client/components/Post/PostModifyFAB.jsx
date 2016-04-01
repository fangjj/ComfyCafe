import React from "react";

import PostUpdateForm from "./PostUpdateForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  FloatingActionButton
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
      <FloatingActionButton primary={true} onTouchTap={this.showPostForm}>
        <Icon>edit</Icon>
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
