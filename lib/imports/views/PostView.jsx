import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import Post from "/lib/imports/components/Post/Post";

const PostView = {
  layout: MainLayout,
  content: {
    main: <Post />
  }
};

export default PostView;
