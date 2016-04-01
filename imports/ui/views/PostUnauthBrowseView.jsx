const PostUnauthBrowseView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
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

export default PostUnauthBrowseView;
