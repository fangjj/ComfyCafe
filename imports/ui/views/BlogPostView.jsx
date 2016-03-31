import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import BlogPost from "/imports/ui/components/Blog/BlogPost";

const BlogPostView = {
  layout: MainLayout,
  content: {
    main: <BlogPost />
  }
};

export default BlogPostView;
