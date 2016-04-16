import React from "react";

import BlogForm from "./BlogForm";
import Dialog from "/imports/ui/client/components/Dialog";
import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showBlogForm() {
    this.setState({showForm: true});
  },
  hideBlogForm() {
    this.setState({showForm: false});
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Write Blog Post"
        formId="formNewBlogPost"
        open={true}
        onClose={this.hideBlogForm}
      >
        <BlogForm
          id="formNewBlogPost"
          onClose={this.hideBlogForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <FAB iconName="add" onTouchTap={this.showBlogForm}>
      {this.renderForm()}
    </FAB>;
  }
});
