export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostBrowseLikes = require("../client/components/Post/PostBrowseLikes").default;
      return {
        main: <PostBrowseLikes />
      };
    }
  },
  fastRender(params) {
    this.subscribe("globalFilters");
    this.subscribe("likes");
  }
};
