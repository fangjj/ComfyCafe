import React from "react";

import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";

export default React.createClass({
  render() {
    return <PostGalleryContainer
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
