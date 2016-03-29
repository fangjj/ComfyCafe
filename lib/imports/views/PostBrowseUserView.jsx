import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostBrowseUser from "/lib/imports/components/Post/PostBrowseUser";

const PostBrowseUserView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseUser />
  }
};

export default PostBrowseUserView;
