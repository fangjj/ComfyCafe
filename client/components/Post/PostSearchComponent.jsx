PostSearchComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    var handle = Meteor.subscribe("searchPosts", tagStr);
    return {
      loading: ! handle.ready(),
      posts: queryTags(tagStr).fetch()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (this.data.posts.length) {
      return <PostGalleryComponent posts={this.data.posts} />;
    } else {
      return <div className="uhoh">
        No results!
      </div>;
    }
  }
});
