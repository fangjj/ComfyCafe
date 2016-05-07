export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostBrowseBookmarks = require("../client/components/Post/PostBrowseBookmarks").default;
      return {
        main: <PostBrowseBookmarks />
      };
    }
  },
  fastRender(params) {
    this.subscribe("bookmarks");
  }
};
