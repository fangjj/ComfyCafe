const PostView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PostContainer = require("../client/components/Post/PostContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostContainer />
        }
      };
    }
  },
  fastRender(params) {
    if (_.has(params, "username")) {
      this.subscribe("post", params.username, params.postName);
    } else {
      this.subscribe("postPerma", params.postId);
    }
  }
};

export default PostView;
