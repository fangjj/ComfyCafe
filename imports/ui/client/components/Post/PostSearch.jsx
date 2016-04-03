import React from "react";

import privacyWrap from "/imports/api/common/privacyWrap";
import tagQuery from "/imports/api/tags/query";
import tagStrFromUrl from "/imports/api/tags/urlify";

import PostGallery from "./PostGallery";
import InlineUhoh from "../InlineUhoh";

const PostSearch = React.createClass({
  render() {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return <PostGallery
      subName="searchPosts"
      subData={tagStr}
      noFab={true}
      generateDoc={function () {
        const friends = expr(() => {
          if (Meteor.user()) {
            return Meteor.user().friends;
          } return [];
        });
        return privacyWrap(tagQuery(tagStr), Meteor.userId(), friends);
      }}
      ifEmpty={function () {
        return <InlineUhoh>
          No results!
        </InlineUhoh>;
      }}
    />;
  }
});

export default PostSearch;