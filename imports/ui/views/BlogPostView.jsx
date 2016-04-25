export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const BlogPost = require("../client/components/Blog/BlogPost").default;
      return {
        layout: MainLayout,
        content: {
          main: <BlogPost />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogPost", params.username, params.slug);
  }
};
