export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const TagList = require("../client/components/Tag/TagList").default;
      return {
        main: <TagList />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allTags");
  }
};
