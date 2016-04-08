import React from "react";

import BlogForm from "./BlogForm";
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
  render() {
    return <FAB iconName="add" onTouchTap={this.showBlogForm}>
      <BlogForm
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});
