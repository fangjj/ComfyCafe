export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const ModLogContainer = require("../client/components/ModLog/ModLogContainer").default;
      return {
        main: <ModLogContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("modlog");
  }
};
