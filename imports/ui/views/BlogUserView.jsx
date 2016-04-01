const BlogUserView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const BlogUser = require("../client/components/Blog/BlogUser").default;
      return {
        layout: MainLayout,
        content: {
          main: <BlogUser />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogBy", params.username);
  }
};

export default BlogUserView;
