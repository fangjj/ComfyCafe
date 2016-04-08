import React from "react";

import BlogUpdateForm from "./BlogUpdateForm";
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
    return <FAB iconName="edit" onTouchTap={this.showBlogForm}>
      <BlogUpdateForm
        post={this.props.post}
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});
