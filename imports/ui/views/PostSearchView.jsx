const PostSearchView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PostSearch = require("../client/components/Post/PostSearch").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostSearch />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("searchPosts", params.rawTagStr);
  }
};

export default PostSearchView;
