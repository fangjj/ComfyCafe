import React from "react";

import metaBuilder from "/imports/ui/utils/metaBuilder";
import privacyWrap from "/imports/api/common/privacyWrap";
import tagQuery from "/imports/api/tags/query";
import { tagStrFromUrl } from "/imports/api/tags/urlify";
import PostGalleryContainer from "./PostGalleryContainer";
import InlineUhoh from "/imports/ui/components/InlineUhoh";

export default React.createClass({
  componentWillMount() {
    const tags = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    metaBuilder({
      title: "Search: " + tags,
      description: "All the cool stuff matching the query `" + tags + "`."
    });
  },
  render() {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return <PostGalleryContainer
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
