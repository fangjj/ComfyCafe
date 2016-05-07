export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const BlogUser = require("../client/components/Blog/BlogUser").default;
      return {
        main: <BlogUser />
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogBy", params.username);
  }
};
