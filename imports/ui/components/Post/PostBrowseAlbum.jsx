import React from "react";

import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  render() {
    return <PostGalleryContainer
      subName="postAlbum"
      subData={{
        username: FlowRouter.getParam("username"),
        slug: FlowRouter.getParam("albumSlug")
      }}
      fabCond={function () {
        return this.props.currentUser.username === FlowRouter.getParam("username");
      }}
      generateDoc={function () {
        return {};
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          This album is empty.
        </InlineUhoh>;
      }}
    />;
  }
});
