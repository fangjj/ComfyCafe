PostSearchComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    var handle = Meteor.subscribe("searchPosts", tagStr);
    return {
      loading: ! handle.ready(),
      posts: queryTags(tagStr, Meteor.userId()).fetch(),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (this.data.posts.length) {
      return <PostGallery
        posts={this.data.posts}
        currentUser={this.data.currentUser}
      />;
    } else {
      return <Uhoh>
        No results!
      </Uhoh>;
    }
  }
});
