import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.blogPosts, (blog) => {
      const url = FlowRouter.path("adminView", {
        panel: "blog",
        id: blog._id
      });
      return <li key={blog._id}>
        <a href={url}>{blog.owner.username + "/" + blog.name}</a>
      </li>;
    });
  },
  render() {
    return <DenseContent>
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});
