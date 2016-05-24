import React from "react";

import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  render() {
    return <PostGalleryContainer
      subName="imagesBy"
      subData={FlowRouter.getParam("username")}
      noFab={true}
      generateDoc={function () {
        return { "owner.username": FlowRouter.getParam("username") };
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          {FlowRouter.getParam("username") + " hasn't uploaded anything yet!"}
        </InlineUhoh>;
      }}
    />;
  }
});
