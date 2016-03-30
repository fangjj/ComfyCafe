import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import TagList from "/imports/ui/components/Tag/TagList";

const TagListView = {
  layout: MainLayout,
  content: {
    main: <TagList />
  }
};

export default TagListView;
