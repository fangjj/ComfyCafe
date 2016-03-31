import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import BlogList from "/imports/ui/components/Blog/BlogList";

const BlogFeedView = {
  layout: MainLayout,
  content: {
    main: <BlogList />
  }
};

export default BlogFeedView;
