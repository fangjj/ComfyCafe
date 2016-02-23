PostBrowseAllComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("allPosts");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
  			{ },
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
