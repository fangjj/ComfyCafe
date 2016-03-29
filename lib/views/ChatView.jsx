import React from "react";

ChatView = {
  layout: MainLayout,
  content: {
    main: <Chat />,
    dense: true
  },
  fastrender(params) {
    if (_.has(params, "topicId")) {
      this.subscribe("topic", params.topicId);
    } else {
      this.subscribe("room", params.roomId);
    }
  }
};
