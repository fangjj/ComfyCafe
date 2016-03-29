import React from "react";

TagListView = {
  layout: MainLayout,
  content: {
    main: <TagList />
  },
  fastrender(params) {
    this.subscribe("allTags");
  }
};
