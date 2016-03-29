import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import UserProfileComponent from "/lib/imports/components/User/UserProfileComponent";

const UserProfileView = {
  layout: MainLayout,
  content: {
    main: <UserProfileComponent />
  }
};

export default UserProfileView;
