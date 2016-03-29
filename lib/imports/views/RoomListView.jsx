import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import RoomList from "/lib/imports/components/Chat/RoomList";

const RoomListView = {
  layout: MainLayout,
  content: {
    main: <RoomList />
  }
};

export default RoomListView;
