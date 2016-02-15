PostBrowseUserComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("artBy", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
        { "uploader.username": FlowRouter.getParam("username") },
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
