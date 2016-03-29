import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import TagList from "/lib/imports/components/Tag/TagList";

const TagListView = {
  layout: MainLayout,
  content: {
    main: <TagList />
  }
};

export default TagListView;
