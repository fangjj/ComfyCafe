import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import BlogPost from "/lib/imports/components/Blog/BlogPost";

const BlogPostView = {
  layout: MainLayout,
  content: {
    main: <BlogPost />
  }
};

export default BlogPostView;
