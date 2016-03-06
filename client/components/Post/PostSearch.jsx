PostSearch = React.createClass({
  render() {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return <PostGallery
      subName="searchPosts"
      subData={tagStr}
      generateDoc={function () {
        return privacyWrap(queryTags(tagStr), Meteor.userId(), Meteor.user().friends);
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          No results!
        </InlineUhoh>;
      }}
    />;
  }
});
