import React from "react";

PostBrowseAllView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseAll />
  },
  fastrender(params) {
    this.subscribe("allPosts");
  }
};
