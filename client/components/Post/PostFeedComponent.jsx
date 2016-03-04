PostFeedComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("postFeed");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			{ $or: [
  				{ "owner._id": Meteor.userId() },
  				{ "owner._id": { $in: Meteor.user() && Meteor.user().subscriptions || [] } }
  			] },
  			{ sort: { createdAt: -1, name: 1 } }
  		).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderInner() {
    if (this.data.posts.length) {
      return <PostGallery
        posts={this.data.posts}
        currentUser={this.data.currentUser}
      />;
    } else {
      var msg;
      if (this.data.currentUser.subscriptions.length) {
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
      <UploadFAB />
    </div>;
  }
});
