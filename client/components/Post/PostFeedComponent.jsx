PostFeedComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("postFeed");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			{ $or: [
  				{ "uploader._id": Meteor.userId() },
  				{ "uploader._id": { $in: Meteor.user() && Meteor.user().subscriptions || [] } }
  			] },
  			{ sort: { createdAt: -1, name: 1 } }
  		).fetch(),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (this.data.posts.length) {
      return <PostGalleryComponent posts={this.data.posts} />;
    } else {
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
  }
});
