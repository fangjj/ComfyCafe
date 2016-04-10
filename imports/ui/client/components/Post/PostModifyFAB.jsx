import React from "react";

import PostForm from "./PostForm";
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
      <PostForm
        post={this.props.post}
        onClose={this.hidePostForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});
