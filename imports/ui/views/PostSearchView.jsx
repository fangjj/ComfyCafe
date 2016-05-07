export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostSearch = require("../client/components/Post/PostSearch").default;
      return {
        main: <PostSearch />
      };
    }
  },
  fastRender(params) {
    this.subscribe("searchPosts", params.rawTagStr);
  }
};
