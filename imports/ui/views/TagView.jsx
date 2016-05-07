export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const Tag = require("../client/components/Tag/Tag").default;
      return {
        main: <Tag />
      };
    }
  },
  fastRender(params) {
    this.subscribe("tag", params.tagName);
  }
};
