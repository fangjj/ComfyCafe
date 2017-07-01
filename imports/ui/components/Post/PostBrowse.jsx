import React from "react";

import defaultMeta from "/imports/ui/utils/defaultMeta";
import legitBool from "/imports/ui/utils/legitBool";
import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  componentWillMount() {
    defaultMeta();
  },
  render() {
    return <PostGalleryContainer
      subName="allPosts"
      generateDoc={function () {
        return { legit: legitBool(this.props.legit) };
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
