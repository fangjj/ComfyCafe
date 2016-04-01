const TagTestView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const TagTest = require("../client/components/Tag/TagTest").default;
      return {
        layout: MainLayout,
        content: {
          main: <TagTest />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("allTags");
  }
};

export default TagTestView;
