export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostBrowseAll = require("../client/components/Post/PostBrowseAll").default;
      return {
        main: <PostBrowseAll />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allPosts");
  }
};
