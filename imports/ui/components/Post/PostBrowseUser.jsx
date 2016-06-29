import React from "react";

import metaBuilder from "/imports/ui/utils/metaBuilder";
import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  componentWillMount() {
    metaBuilder({
      title: FlowRouter.getParam("username") + "'s Images",
      description: "All the cool stuff from " + FlowRouter.getParam("username") + "."
    });
  },
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
