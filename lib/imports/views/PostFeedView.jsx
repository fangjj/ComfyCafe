import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostFeed from "/lib/imports/components/Post/PostFeed";

const PostFeedView = {
  layout: MainLayout,
  content: {
    main: <PostFeed />
  }
};

export default PostFeedView;
