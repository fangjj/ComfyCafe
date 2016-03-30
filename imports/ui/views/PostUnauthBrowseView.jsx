import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";

const PostUnauthBrowseView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseAll />
  }
};

export default PostUnauthBrowseView;
