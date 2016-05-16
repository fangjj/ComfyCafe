import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import ChatView from "/imports/ui/views/ChatView";
import RoomListView from "/imports/ui/views/RoomListView";

const chatRoutes = FlowRouter.group({ prefix: "/c" });

chatRoutes.route("/", {
  name: "roomList",
  action: function () {
    setTitle("Communities");
    renderView(RoomListView);
  }
});

chatRoutes.route("/:roomSlug", {
  name: "room",
  action: function () {
    setTitle("Loading Community...");
    renderView(ChatView);
  }
});

chatRoutes.route("/:roomSlug/:topicSlug", {
  name: "topic",
  action: function () {
    setTitle("Loading Topic...");
    renderView(ChatView);
  }
});
