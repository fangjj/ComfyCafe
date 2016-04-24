export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PageListContainer = require("../client/components/Page/PageListContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <PageListContainer />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("pagesBy", params.username);
  }
};
