import React from "react";

PostFeedView = {
  layout: MainLayout,
  content: {
    main: <PostFeed />
  },
  fastrender(params) {
    this.subscribe("postFeed");
  }
};
