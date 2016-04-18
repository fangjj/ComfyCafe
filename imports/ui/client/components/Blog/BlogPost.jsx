import React from "react";

import BlogPosts from "/imports/api/blog/collection";
import BlogListItem from "./BlogListItem";
import FAB from "/imports/ui/client/components/FAB";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
  },
  getMeteorData() {
    const id = FlowRouter.getParam("postId");
    const handle = Meteor.subscribe("blogPost", id);
    return {
      loading: ! handle.ready(),
      post: BlogPosts.findOne({ _id: id }),
      currentUser: Meteor.user()
    };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  renderFab() {
    const isOwner = this.data.currentUser
      && this.data.currentUser._id === this.data.post.owner._id;
    if (isOwner) {
      return <FAB iconName="edit" onTouchTap={this.showForm} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    return <ol className="contentList">
      <BlogListItem post={this.data.post} currentUser={this.data.currentUser} />
      {this.renderFab()}
    </ol>;
  }
});
