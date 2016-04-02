const Err404View = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const Err404 = require("../client/components/Err404").default;
      return {
        layout: MainLayout,
        content: {
          main: <Err404 />
        }
      };
    }
  }
};

export default Err404View;
