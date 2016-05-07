export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const Err404 = require("../client/components/Err404").default;
      return {
        main: <Err404 />
      };
    }
  }
};
