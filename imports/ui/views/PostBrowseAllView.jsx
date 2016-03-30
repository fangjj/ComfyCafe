import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";

const PostBrowseAllView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseAll />
  }
};

export default PostBrowseAllView;
