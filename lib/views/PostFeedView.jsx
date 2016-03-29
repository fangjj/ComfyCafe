import React from "react";

const PostFeedView = {
  layout: MainLayout,
  content: {
    main: <PostFeed />
  },
  fastrender(params) {
    this.subscribe("postFeed");
  }
};

export default PostFeedView;
