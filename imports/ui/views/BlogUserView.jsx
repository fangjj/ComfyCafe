import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import BlogUser from "/imports/ui/components/Blog/BlogUser";

const BlogUserView = {
  layout: MainLayout,
  content: {
    main: <BlogUser />
  }
};

export default BlogUserView;
