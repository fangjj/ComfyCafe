const PostBrowseAllView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PostBrowseAll = require("../client/components/Post/PostBrowseAll").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostBrowseAll />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("allPosts");
  }
};

export default PostBrowseAllView;
