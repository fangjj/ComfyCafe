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
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (! this.data.posts.length) {
      var msg;
      if (this.data.currentUser.subscriptions.length) {
        msg = "None of your subscriptions have posted anything...";
      } else {
        msg = "You haven't subscribed to anyone!";
      }
      return <div className="uhoh">
        {msg}
      </div>;
    }

    return <ol className="blog">
      {this.renderPosts()}
    </ol>;
  }
});
