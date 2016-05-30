import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import RoomListContainer from "/imports/ui/components/Chat/RoomListContainer";
import Chat from "/imports/ui/components/Chat/Chat";
import ChatAdmin from "/imports/ui/components/Chat/Admin/ChatAdmin";

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

const communityAdminRoutes = FlowRouter.group({ prefix: "/ca" });

communityAdminRoutes.route("/:roomSlug", {
  name: "communityAdmin",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <ChatAdmin />,
      dense: true
    });
  }
});

communityAdminRoutes.route("/:roomSlug/:panel", {
  name: "communityAdminPanel",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <ChatAdmin />,
      dense: true
    });
  }
});

communityAdminRoutes.route("/:roomSlug/:panel/:id", {
  name: "communityAdminView",
  action: function () {
    setTitle("Admin Panel");
    render({
      main: <ChatAdmin />,
      dense: true
    });
  }
});

const dmRoutes = FlowRouter.group({ prefix: "/dm" });

dmRoutes.route("/", {
  name: "dmList",
  action: function () {
    setTitle("Direct Messages");
    render({
      main: <Chat dmList={true} />,
      dense: true
    });
  }
});

dmRoutes.route("/:username", {
  name: "dm",
  action: function () {
    const username = FlowRouter.getParam("username");
    setTitle(username);
    render({
      main: <Chat dmWith={username} />,
      dense: true
    });
  }
});
