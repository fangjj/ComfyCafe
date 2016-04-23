import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import ChatView from "/imports/ui/views/ChatView";
import RoomListView from "/imports/ui/views/RoomListView";

const chatRoutes = FlowRouter.group({ prefix: "/c" });

chatRoutes.route("/", {
  name: "roomList",
  action: function () {
    setTitle("Chat Rooms");
    renderView(RoomListView);
  }
});

chatRoutes.route("/:roomId", {
  name: "room",
  action: function () {
    setTitle("Loading Room...");
    renderView(ChatView);
  }
});

chatRoutes.route("/:roomId/:topicId", {
  name: "topic",
  action: function () {
    setTitle("Loading Topic...");
    renderView(ChatView);
  }
});
