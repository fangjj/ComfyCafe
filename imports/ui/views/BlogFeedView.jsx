export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const BlogListContainer = require("../client/components/Blog/BlogListContainer").default;
      return {
        main: <BlogListContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogFeed");
  }
};
