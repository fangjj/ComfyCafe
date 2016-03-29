import React from "react";

PostBrowseLikes = React.createClass({
  render() {
    return <PostGallery
      subName="likes"
      requireAuth={true}
      noFab={true}
      generateDoc={function () {
        return { likes: Meteor.userId() };
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          You haven't liked any posts yet!
        </InlineUhoh>;
      }}
    />;
  }
});
