PostBrowseUserComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("yourPosts");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
        { "uploader._id": Meteor.userId() },
  			{ sort: { createdAt: -1, _id: 1 }
  		}).fetch(),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    return <PostBrowseComponent
      posts={this.data.posts}
      currentUser={this.data.currentUser}
    />;
  }
});
