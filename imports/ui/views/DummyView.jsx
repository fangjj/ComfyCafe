const DummyView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const DummyComponent = require("../client/components/DummyComponent").default;
      return {
        layout: MainLayout,
        content: {
          main: <DummyComponent />
        }
      };
    }
  }
};

export default DummyView;
