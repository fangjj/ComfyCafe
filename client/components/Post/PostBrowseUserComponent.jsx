PostBrowseUserComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("artBy", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
        { "owner.username": FlowRouter.getParam("username") },
  			{ sort: { createdAt: -1, _id: 1 }
  		}).fetch(),
      currentUser: Meteor.user()
    };
  },
  renderFab(username) {
    if (this.data.currentUser.username === username) {
      return <UploadFAB />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    const username = FlowRouter.getParam("username");

    if (! this.data.posts.length) {
      return <Uhoh>
        {username + " hasn't uploaded anything yet!"}
      </Uhoh>;
    }

    return <div>
      <PostGallery
        posts={this.data.posts}
        currentUser={this.data.currentUser}
        onFilter={this.applyFilter}
      />
      {this.renderFab(username)}
    </div>;
  }
});
