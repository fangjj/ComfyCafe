import React from "react";

import "/imports/api/media/adminMethods";
import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/client/components/List";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

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
