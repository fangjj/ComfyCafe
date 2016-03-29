import React from "react";

PostBrowseUserView = {
  layout: MainLayout,
  content: {
    main: <PostBrowseUser />
  },
  fastrender(params) {
    this.subscribe("imagesBy", params.username);
  }
};
