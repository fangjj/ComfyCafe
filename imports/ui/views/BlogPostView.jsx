export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const BlogPost = require("../client/components/Blog/BlogPost").default;
      return {
        main: <BlogPost />
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogPost", params.username, params.slug);
  }
};
