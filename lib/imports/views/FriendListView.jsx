import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import FriendList from "/lib/imports/components/User/FriendList";

const FriendListView = {
  layout: MainLayout,
  content: {
    main: <FriendList />
  }
};

export default FriendListView;
