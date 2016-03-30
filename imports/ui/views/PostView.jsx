import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import Post from "/imports/ui/components/Post/Post";

const PostView = {
  layout: MainLayout,
  content: {
    main: <Post />
  }
};

export default PostView;
