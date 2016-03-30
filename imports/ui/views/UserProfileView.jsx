import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import UserProfileComponent from "/imports/ui/components/User/UserProfileComponent";

const UserProfileView = {
  layout: MainLayout,
  content: {
    main: <UserProfileComponent />
  }
};

export default UserProfileView;
