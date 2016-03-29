import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostSearch from "/lib/imports/components/Post/PostSearch";

const PostSearchView = {
  layout: MainLayout,
  content: {
    main: <PostSearch />
  }
};

export default PostSearchView;
