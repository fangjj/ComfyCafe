import React from "react";

import PostGallery from "./PostGallery";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";

export default React.createClass({
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
