import React from "react";

BlogPostView = {
  layout: MainLayout,
  content: {
    main: <BlogPost />
  },
  fastrender(params) {
    this.subscribe("blogPost", params.postId);
  }
};
