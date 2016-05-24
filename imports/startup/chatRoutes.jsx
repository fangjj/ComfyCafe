import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import RoomListContainer from "/imports/ui/components/Chat/RoomListContainer";
import Chat from "/imports/ui/components/Chat/Chat";

const chatRoutes = FlowRouter.group({ prefix: "/c" });

chatRoutes.route("/", {
  name: "roomList",
  action: function () {
    setTitle("Communities");
    render({
      main: <RoomListContainer />
    });
  }
});

chatRoutes.route("/:roomSlug", {
  name: "room",
  action: function () {
    setTitle("Loading Community...");
    render({
      main: <Chat />,
      dense: true
    });
  }
});

chatRoutes.route("/:roomSlug/:topicSlug", {
  name: "topic",
  action: function () {
    setTitle("Loading Topic...");
    render({
      main: <Chat />,
      dense: true
    });
  }
});
