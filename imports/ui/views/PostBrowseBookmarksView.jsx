const PostBrowseBookmarksView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PostBrowseBookmarks = require("../client/components/Post/PostBrowseBookmarks").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostBrowseBookmarks />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("bookmarks");
  }
};

export default PostBrowseBookmarksView;
