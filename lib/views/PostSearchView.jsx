import React from "react";

PostSearchView = {
  layout: MainLayout,
  content: {
    main: <PostSearch />
  },
  fastrender(params) {
    this.subscribe("searchPosts", params.rawTagStr);
  }
};
