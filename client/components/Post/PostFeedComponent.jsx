PostFeedComponent = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      filter: {}
    };
  },
  applyFilter(callback) {
    this.setState({
      filter: callback(this.state.filter)
    });
  },
  getMeteorData() {
    let doc = { $or: [
      { "owner._id": Meteor.userId() },
      { "owner._id": { $in: Meteor.user() && Meteor.user().subscriptions || [] } }
    ] };

    if (this.state.filter) {
      _.each(this.state.filter, (value, key) => {
        doc[key] = value;
      });
    }

    let handle = Meteor.subscribe("postFeed");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			doc,
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

    if (! this.data.posts.length) {
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

    return <PostBrowseComponent
      posts={this.data.posts}
      currentUser={this.data.currentUser}
      onFilter={this.applyFilter}
    />;
  }
});
