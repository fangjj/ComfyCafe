import React from "react";

import BlogPosts from "/imports/api/blog/collection";
import BlogListItem from "/imports/ui/components/Blog/BlogListItem";
import BlogForm from "/imports/ui/components/Blog/BlogForm";
import Dialog from "/imports/ui/components/Dialog";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import Powerless from "/imports/ui/components/Powerless";
import Uhoh from "/imports/ui/components/Uhoh";
import FAB from "/imports/ui/components/FAB";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  renderPosts() {
    if (this.props.posts.length) {
      return this.props.posts.map((post) => {
        return <BlogListItem post={post} key={post._id} />;
      });
    }
    return <li>No posts.</li>;
  },
  renderInner() {
    if (this.props.posts.length) {
      return <ol className="contentList">
        {this.renderPosts()}
      </ol>
    } else {
      let msg;
      if (this.props.userCentric) {
        msg = `${FlowRouter.getParam("username")} hasn't posted anything yet.`;
      } else if (this.context.currentUser.subscriptions
         && this.context.currentUser.subscriptions.length
      ) {
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
    if (this.context.currentUser && ! this.props.hideFab) {
      return <FAB iconName="add" onClick={this.showForm} />;
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
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    if (! this.context.currentUser && ! this.props.userCentric) {
      return <Powerless />;
    }

    return <div>
      {this.renderInner()}
      {this.renderFab()}
      {this.renderForm()}
    </div>;
  }
});
