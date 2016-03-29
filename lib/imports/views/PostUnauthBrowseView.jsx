import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import PostBrowseAll from "/lib/imports/components/Post/PostBrowseAll";

const PostUnauthBrowseView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseAll />
  }
};

export default PostUnauthBrowseView;
