PostBrowseLikesComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("likes");
    return {
      loading: ! handle.ready(),
      posts: Posts.find(
        { likes: Meteor.userId() },
  			{ sort: { createdAt: -1, _id: 1 }
  		}).fetch(),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.posts.length) {
      return <Uhoh>
        You haven't liked any art yet!
      </Uhoh>;
    }

    return <div>
      <PostGallery
        posts={this.data.posts}
        currentUser={this.data.currentUser}
        onFilter={this.applyFilter}
      />
    </div>;
  }
});
