export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const Chat = require("../client/components/Chat/Chat").default;
      return {
        main: <Chat />,
        dense: true
      };
    }
  },
  fastRender(params) {
    if (_.has(params, "topicId")) {
      this.subscribe("topic", params.topicId);
    } else {
      this.subscribe("room", params.roomSlug);
    }
  }
};
