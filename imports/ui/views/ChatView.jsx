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
    if (_.has(params, "topicSlug")) {
      this.subscribe("topic", params.roomSlug, params.topicSlug);
    } else {
      this.subscribe("room", params.roomSlug);
    }
  }
};
