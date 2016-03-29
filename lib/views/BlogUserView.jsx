import React from "react";

BlogUserView = {
  layout: MainLayout,
  content: {
    main: <BlogUser />
  },
  fastrender(params) {
    this.subscribe("blogBy", params.username);
  }
};
