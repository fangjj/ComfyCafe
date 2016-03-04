PostSearch = React.createClass({
  render() {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return <PostGallery
      subName="searchPosts"
      subData={tagStr}
      generateDoc={function () {
        return queryTags(tagStr, Meteor.userId());
      }}
      ifEmpty={function () {
        return <Uhoh>
          No results!
        </Uhoh>;
      }}
    />;
  }
});
