import React from "react";

import BlogPosts from "/imports/api/blog/collection";

import BlogListItem from "./BlogListItem";
import BlogForm from "./BlogForm";
import Dialog from "/imports/ui/client/components/Dialog";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Powerless from "/imports/ui/client/components/Powerless";
import Uhoh from "/imports/ui/client/components/Uhoh";
import FAB from "/imports/ui/client/components/FAB";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
  },
  getMeteorData() {
    let subs = [];
    if (Meteor.userId()) {
      subs = Meteor.user().subscriptions || [];
    }

    const handle = Meteor.subscribe("blogFeed");
    return {
      loading: ! handle.ready(),
      posts: BlogPosts.find(
        { $or: [
          { "owner._id": Meteor.userId() },
          {
            "owner._id": { $in: subs },
            visibility: { $ne: "unlisted" }
          }
        ] },
        { sort: { createdAt: -1, name: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
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
      let msg;
      if (this.data.currentUser.subscriptions && this.data.currentUser.subscriptions.length) {
        msg = "None of your subscriptions have posted anything...";
      } else {
        msg = "You haven't subscribed to anyone!";
      }
      return <Uhoh>
        {msg}
      </Uhoh>;
    }
  },
  renderFab() {
    if (this.data.currentUser) {
      return <FAB iconName="add" onTouchTap={this.showForm} />;
    }
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Write Blog Post"
        formId="formNewBlogPost"
        open={true}
        onClose={this.hideForm}
      >
        <BlogForm
          id="formNewBlogPost"
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    if (! this.data.currentUser) {
      return <Powerless />;
    }

    return <div>
      {this.renderInner()}
      {this.renderFab()}
      {this.renderForm()}
    </div>;
  }
});
