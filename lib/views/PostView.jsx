import React from "react";

PostView = {
  layout: MainLayout,
  content: {
    main: <Post />
  },
  fastrender(params) {
    if (_.has(params, "username")) {
      this.subscribe("post", params.username, params.postName);
    } else {
      this.subscribe("postPerma", params.postId);
    }
  }
};
