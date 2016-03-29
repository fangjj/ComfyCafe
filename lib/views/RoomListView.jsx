import React from "react";

RoomListView = {
  layout: MainLayout,
  content: {
    main: <RoomList />
  },
  fastrender(params) {
    this.subscribe("allRooms");
  }
};
