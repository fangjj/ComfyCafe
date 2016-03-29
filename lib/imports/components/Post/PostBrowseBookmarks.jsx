import React from "react";

const PostBrowseBookmarks = React.createClass({
  render() {
    return <PostGallery
      subName="bookmarks"
      requireAuth={true}
      noFab={true}
      generateDoc={function () {
        return { _id: { $in: Meteor.user().bookmarks || [] } };
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          You haven't bookmarked any posts yet!
        </InlineUhoh>;
      }}
    />;
  }
});

export default PostBrowseBookmarks;
