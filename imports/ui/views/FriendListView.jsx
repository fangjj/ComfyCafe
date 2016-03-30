import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import FriendList from "/imports/ui/components/User/FriendList";

const FriendListView = {
  layout: MainLayout,
  content: {
    main: <FriendList />
  }
};

export default FriendListView;
