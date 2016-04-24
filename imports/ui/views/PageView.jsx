export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const PageContainer = require("../client/components/Page/PageContainer").default;
      return {
        layout: MainLayout,
        content: {
          main: <PageContainer />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("page", params.username, params.slug);
  }
};
