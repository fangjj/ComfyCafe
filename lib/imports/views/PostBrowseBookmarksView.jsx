import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostBrowseBookmarks from "/lib/imports/components/Post/PostBrowseBookmarks";

const PostBrowseBookmarksView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseBookmarks />
  }
};

export default PostBrowseBookmarksView;
