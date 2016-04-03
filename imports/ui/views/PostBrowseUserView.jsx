const PostBrowseUserView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PostBrowseUser = require("../client/components/Post/PostBrowseUser").default;
      return {
        layout: MainLayout,
        content: {
          main: <PostBrowseUser />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("imagesBy", params.username);
  }
};

export default PostBrowseUserView;
