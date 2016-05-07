export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const PageListContainer = require("../client/components/Page/PageListContainer").default;
      return {
        main: <PageListContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("pagesBy", params.username);
  }
};
