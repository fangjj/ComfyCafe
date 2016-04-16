import React from "react";

import BlogForm from "./BlogForm";
import Dialog from "/imports/ui/client/components/Dialog";
import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showBlogForm() {
    this.setState({ showForm: true });
  },
  hideBlogForm() {
    this.setState({ showForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Blog Post"
        formId={"form" + this.props.post._id}
        open={true}
        onClose={this.hideBlogForm}
      >
        <BlogForm
          id={"form" + this.props.post._id}
          post={this.props.post}
          onClose={this.hideBlogForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <FAB iconName="edit" onTouchTap={this.showBlogForm}>
      {this.renderForm()}
    </FAB>;
  }
});
