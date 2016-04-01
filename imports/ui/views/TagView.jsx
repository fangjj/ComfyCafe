const TagView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const Tag = require("../client/components/Tag/Tag").default;
      return {
        layout: MainLayout,
        content: {
          main: <Tag />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("tag", params.tagName);
  }
};

export default TagView;
