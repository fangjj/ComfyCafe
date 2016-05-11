export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PostBrowseUser = require("../client/components/Post/PostBrowseUser").default;
      return {
        main: <PostBrowseUser />
      };
    }
  },
  fastRender(params) {
    this.subscribe("globalFilters");
    this.subscribe("imagesBy", params.username);
  }
};
