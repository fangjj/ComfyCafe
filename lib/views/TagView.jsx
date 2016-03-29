import React from "react";

TagView = {
  layout: MainLayout,
  content: {
    main: <Tag />
  },
  fastrender(params) {
    this.subscribe("tag", params.tagName);
  }
};
