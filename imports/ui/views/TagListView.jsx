const TagListView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const TagList = require("../client/components/Tag/TagList").default;
      return {
        layout: MainLayout,
        content: {
          main: <TagList />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("allTags");
  }
};

export default TagListView;
