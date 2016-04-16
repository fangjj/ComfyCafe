import React from "react";

import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";

export default React.createClass({
  render() {
    return <PostGalleryContainer
      subName="allPosts"
      generateDoc={function () {
        return {};
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          You haven't uploaded anything!
          <div className="smaller">
            To upload a file, either press the button in the bottom right corner, or just drop a file anywhere.
          </div>
        </InlineUhoh>;
      }}
    />;
  }
});
