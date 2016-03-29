import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import BlogList from "/lib/imports/components/Blog/BlogList";

const BlogFeedView = {
  layout: MainLayout,
  content: {
    main: <BlogList />
  }
};

export default BlogFeedView;
