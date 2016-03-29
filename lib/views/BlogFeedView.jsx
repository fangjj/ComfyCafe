import React from "react";

BlogFeedView = {
  layout: MainLayout,
  content: {
    main: <BlogList />
  },
  fastrender(params) {
    this.subscribe("blogFeed");
  }
};
