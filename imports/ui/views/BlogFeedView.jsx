const BlogFeedView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const BlogList = require("../client/components/Blog/BlogList").default;
      return {
        layout: MainLayout,
        content: {
          main: <BlogList />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogFeed");
  }
};

export default BlogFeedView;
