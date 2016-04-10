import React from "react";

import PostForm from "./PostForm";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";

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
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Post"
        formId={"form" + this.props.post._id}
        open={this.state.showForm}
        onClose={this.hidePostForm}
      >
        <PostForm
          id={"form" + this.props.post._id}
          post={this.props.post}
          onClose={this.hidePostForm}
          open={this.state.showForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <FAB iconName="edit" onTouchTap={this.showPostForm}>
      {this.renderForm()}
    </FAB>;
  }
});
