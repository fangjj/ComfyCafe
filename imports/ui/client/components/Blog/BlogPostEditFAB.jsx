import React from "react";

import BlogUpdateForm from "./BlogUpdateForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  FloatingActionButton
} from "material-ui";

const BlogPostEditFAB = React.createClass({
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
      <FloatingActionButton primary={true} onClick={this.showBlogForm}>
        <Icon>edit</Icon>
      </FloatingActionButton>
      <BlogUpdateForm
        post={this.props.post}
        handleClose={this.hideBlogForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default BlogPostEditFAB;
