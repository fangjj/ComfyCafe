import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostSearch from "/imports/ui/components/Post/PostSearch";

const PostSearchView = {
  layout: MainLayout,
  content: {
    main: <PostSearch />
  }
};

export default PostSearchView;
