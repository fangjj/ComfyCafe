import React from "react";

import BlogListItem from "./BlogListItem";
import BlogPostFAB from "./BlogPostFAB";
import LoadingSpinner from "../LoadingSpinner";
import Uhoh from "../Uhoh";

const BlogUser = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const username =  FlowRouter.getParam("username");
    const handle = Meteor.subscribe("blogBy", username);
    return {
      loading: ! handle.ready(),
      posts: BlogPosts.find(
        { "owner.username": username },
        { sort: { createdAt: -1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderPosts() {
    if (this.data.posts.length) {
      return this.data.posts.map((post) => {
        return <BlogListItem post={post} currentUser={this.data.currentUser} key={post._id} />;
      });
    }
    return <li>No posts.</li>;
  },
  renderInner() {
    if (this.data.posts.length) {
      return <ol className="contentList">
        {this.renderPosts()}
      </ol>
    } else {
      return <Uhoh>
        {FlowRouter.getParam("username") + " hasn't written any posts yet."}
      </Uhoh>;
    }
  },
  renderFab() {
    const username = _.get(this, "data.currentUser.username");
    if (username === FlowRouter.getParam("username")) {
      return <BlogPostFAB />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    return <div>
      {this.renderInner()}
      {this.renderFab()}
    </div>;
  }
});

export default BlogUser;
