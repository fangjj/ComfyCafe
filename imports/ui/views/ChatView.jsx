const ChatView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/components/Layout/MainLayout").default;
      const Chat = require("../client/components/Chat/Chat").default;
      return {
        layout: MainLayout,
        content: {
          main: <Chat />,
          dense: true
        }
      };
    }
  },
  fastRender(params) {
    if (_.has(params, "topicId")) {
      this.subscribe("topic", params.topicId);
    } else {
      this.subscribe("room", params.roomId);
    }
  }
};

export default ChatView;
