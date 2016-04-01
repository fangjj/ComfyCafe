const LoadingTestView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const LoadingSpinner = require("../client/components/LoadingSpinner").default;
      return {
        layout: MainLayout,
        content: {
          main: <LoadingSpinner />
        }
      };
    }
  }
};

export default LoadingTestView;
