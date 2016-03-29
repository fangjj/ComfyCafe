import React from "react";

const PostSearch = React.createClass({
  render() {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return <PostGallery
      subName="searchPosts"
      subData={tagStr}
      noFab={true}
      generateDoc={function () {
        return privacyWrap(tagQuery(tagStr), Meteor.userId(), Meteor.user().friends);
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          No results!
        </InlineUhoh>;
      }}
    />;
  }
});

export default PostSearch;
