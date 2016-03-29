import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostBrowseLikes from "/lib/imports/components/Post/PostBrowseLikes";

const PostBrowseLikesView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseLikes />
  }
};

export default PostBrowseLikesView;
