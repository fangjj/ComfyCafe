import React from "react";

import BlogForm from "./BlogForm";
import Icon from "../Icon";

import {
  FloatingActionButton
} from "material-ui";

const BlogPostFAB = React.createClass({
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
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showBlogForm}>
        <Icon>add</Icon>
      </FloatingActionButton>
      <BlogForm
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default BlogPostFAB;
