const PostFeedView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const PostFeed = require("../client/components/Post/PostFeed").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostFeed />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("postFeed");
  }
};

export default PostFeedView;
