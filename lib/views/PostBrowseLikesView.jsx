import React from "react";

PostBrowseLikesView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseLikes />
  },
  fastrender(params) {
    this.subscribe("likes");
  }
};
