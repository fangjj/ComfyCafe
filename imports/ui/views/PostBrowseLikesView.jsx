import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostBrowseLikes from "/imports/ui/components/Post/PostBrowseLikes";

const PostBrowseLikesView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseLikes />
  }
};

export default PostBrowseLikesView;
