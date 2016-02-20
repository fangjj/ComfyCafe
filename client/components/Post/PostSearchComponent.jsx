PostSearchComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    var handle = Meteor.subscribe("searchPosts", tagStr);
    return {
      loading: ! handle.ready(),
      posts: queryTags(tagStr, Meteor.userId()).fetch()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (this.data.posts.length) {
      return <PostGalleryComponent posts={this.data.posts} />;
    } else {
      return <Uhoh>
        No results!
      </Uhoh>;
    }
  }
});
