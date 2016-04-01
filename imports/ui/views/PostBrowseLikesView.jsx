const PostBrowseLikesView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const PostBrowseLikes = require("../client/components/Post/PostBrowseLikes").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostBrowseLikes />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("likes");
  }
};

export default PostBrowseLikesView;
