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

    if (! this.data.posts.length) {
      return <Uhoh>
        You haven't uploaded anything!
        <div className="smaller">
          To upload a file, either press the button in the bottom right corner, or just drop a file anywhere.
        </div>
      </Uhoh>;
    }

    return <div>
      <PostGallery
        posts={this.data.posts}
        currentUser={this.data.currentUser}
        onFilter={this.applyFilter}
      />
      <UploadFAB />
    </div>;
  }
});
