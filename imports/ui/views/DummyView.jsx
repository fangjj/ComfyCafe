export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const DummyComponent = require("../client/components/DummyComponent").default;
      return {
        main: <DummyComponent />
      };
    }
  }
};
