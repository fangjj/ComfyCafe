import React from "react";

import PostGallery from "./PostGallery";
import InlineUhoh from "../InlineUhoh";

const PostBrowseUser = React.createClass({
  render() {
    return <PostGallery
      subName="imagesBy"
      subData={FlowRouter.getParam("username")}
      fabCond={function () {
        return this.data.currentUser.username === FlowRouter.getParam("username");
      }}
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

export default PostBrowseUser;