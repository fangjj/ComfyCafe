import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import BlogUser from "/lib/imports/components/Blog/BlogUser";

const BlogUserView = {
  layout: MainLayout,
  content: {
    main: <BlogUser />
  }
};

export default BlogUserView;
