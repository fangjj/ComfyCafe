import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostFeed from "/imports/ui/components/Post/PostFeed";

const PostFeedView = {
  layout: MainLayout,
  content: {
    main: <PostFeed />
  }
};

export default PostFeedView;
