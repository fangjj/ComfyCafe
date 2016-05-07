import React from "react";

import setTitle from "/imports/api/common/setTitle";
import BlogPosts from "/imports/api/blog/collection";
import BlogListItem from "./BlogListItem";
import FAB from "/imports/ui/client/components/FAB";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineTopic from "/imports/ui/client/components/Chat/InlineTopic";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const username = FlowRouter.getParam("username");
    const slug = FlowRouter.getParam("slug");
    const handle = Meteor.subscribe("blogPost", username, slug);
    return {
      loading: ! handle.ready(),
      post: BlogPosts.findOne(
        {
          slug: slug,
          "owner.username": username
        }
      ),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading || ! this.data.post) {
      return <LoadingSpinner />;
    }

    setTitle(this.data.post.name);

    return <article className="blog contentLayout">
      <ol className="contentList">
        <BlogListItem post={this.data.post} solo={true} currentUser={this.data.currentUser} />
      </ol>
      <section className="comments content">
        <InlineTopic
          topicId={this.data.post.topic._id}
          currentUser={this.data.currentUser}
        />
      </section>
    </article>;
  }
});
