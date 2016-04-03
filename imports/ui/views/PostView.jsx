const PostView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const Post = require("../client/components/Post/Post").default;
      return {
        layout: MainLayout,
        content: {
          main: <Post />
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
