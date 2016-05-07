export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const BlogList = require("../client/components/Blog/BlogList").default;
      return {
        main: <BlogList />
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogFeed");
  }
};
