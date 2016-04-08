import React from "react";

import PostUpdateForm from "./PostUpdateForm";
import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
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
    return <FAB iconName="edit" onTouchTap={this.showPostForm}>
      <PostUpdateForm
        post={this.props.post}
        handleClose={this.hidePostForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});
