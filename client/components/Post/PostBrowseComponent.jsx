PostBrowseComponent = React.createClass({
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

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (this.data.posts.length) {
      return <PostGalleryComponent posts={this.data.posts} />;
    } else {
      return <div className="uhoh">
        You haven't uploaded anything!
        <div className="smaller">
          To upload a file, either press the button in the bottom right corner, or just drop a file anywhere.
        </div>
      </div>;
    }
  }
});
