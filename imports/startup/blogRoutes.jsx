import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import BlogListContainer from "/imports/ui/components/Blog/BlogListContainer";
import BlogUserContainer from "/imports/ui/components/Blog/BlogUserContainer";
import BlogPost from "/imports/ui/components/Blog/BlogPost";

const blogRoutes = FlowRouter.group({ prefix: "/b" });

blogRoutes.route("/", {
  name: "blog",
  action: function () {
    setTitle();
    render({
      main: <BlogListContainer />
    });
  }
});

blogRoutes.route("/:username", {
  name: "blogBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Blog");
    render({
      main: <BlogUserContainer />
    });
  }
});

blogRoutes.route("/:username/:slug", {
  name: "blogPost",
  action: function () {
    setTitle(FlowRouter.getParam("slug"));
    render({
      main: <BlogPost />
    });
  }
});
