export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PageContainer = require("../client/components/Page/PageContainer").default;
      return {
        main: <PageContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("page", params.username, params.slug);
  }
};
