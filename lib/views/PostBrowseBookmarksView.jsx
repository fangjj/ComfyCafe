import React from "react";

PostBrowseBookmarksView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseBookmarks />
  },
  fastrender(params) {
    this.subscribe("bookmarks");
  }
};
