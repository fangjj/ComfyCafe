export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const TagTest = require("../client/components/Tag/TagTest").default;
      return {
        main: <TagTest />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allTags");
  }
};
