import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostBrowseBookmarks from "/imports/ui/components/Post/PostBrowseBookmarks";

const PostBrowseBookmarksView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseBookmarks />
  }
};

export default PostBrowseBookmarksView;
