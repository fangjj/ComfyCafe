import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/components/Err404";
import BlogForm from "/imports/ui/components/Blog/BlogForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const blog = this.props.blog;
    if (! blog) {
      return <Err404 />;
    }

    const url = FlowRouter.path("post", {
      username: blog.owner.username,
      postName: blog.name
    });
    const ownerUrl = FlowRouter.path("profile", { username: blog.owner.username });
    return <DenseContent>
      <header>
        <h2><a href={ownerUrl}>{blog.owner.username}</a>/<a href={url}>{blog.name}</a></h2>
      </header>
      <BlogForm post={blog} mod={true} actions={true} />
    </DenseContent>;
  }
});
