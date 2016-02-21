BlogList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("blogFeed");
    return {
      loading: ! handle.ready(),
      posts: BlogPosts.find(
        { $or: [
          { "owner._id": Meteor.userId() },
          { "owner._id": { $in: Meteor.user() && Meteor.user().subscriptions || [] } }
        ] },
        { sort: { createdAt: -1, name: 1 } }
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
      var msg;
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
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    return <div>
      {this.renderInner()}
      <BlogPostFAB />
    </div>;
  }
});
