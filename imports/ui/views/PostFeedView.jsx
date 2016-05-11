export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostFeed = require("../client/components/Post/PostFeed").default;
      return {
        main: <PostFeed />
      };
    }
  },
  fastRender(params) {
    this.subscribe("globalFilters");
    this.subscribe("postFeed");
  }
};
