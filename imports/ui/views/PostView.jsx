export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostContainer = require("../client/components/Post/PostContainer").default;
      return {
        main: <PostContainer />
      };
    }
  },
  fastRender(params) {
    if (_.has(params, "username")) {
      this.subscribe("post", params.username, params.postName);
    } else {
      this.subscribe("postPerma", params.postId);
    }
  }
};
