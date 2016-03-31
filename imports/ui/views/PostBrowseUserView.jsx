import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostBrowseUser from "/imports/ui/components/Post/PostBrowseUser";

const PostBrowseUserView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseUser />
  }
};

export default PostBrowseUserView;
