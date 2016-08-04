import React from "react";

import metaBuilder from "/imports/ui/utils/metaBuilder";
import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  componentWillMount() {
    metaBuilder({
      title: "Likes",
      description: "All the cool stuff you've liked."
    });
  },
  render() {
    return <PostGalleryContainer
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
