import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import RoomList from "/imports/ui/components/Chat/RoomList";

const RoomListView = {
  layout: MainLayout,
  content: {
    main: <RoomList />
  }
};

export default RoomListView;
