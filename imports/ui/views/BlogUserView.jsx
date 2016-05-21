export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const BlogUserContainer = require("../client/components/Blog/BlogUserContainer").default;
      return {
        main: <BlogUserContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("blogBy", params.username);
  }
};
