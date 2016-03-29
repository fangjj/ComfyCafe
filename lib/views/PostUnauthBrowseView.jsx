import React from "react";

PostUnauthBrowseView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseAll />
  },
  fastrender(params) {
    this.subscribe("allPosts");
  }
};
