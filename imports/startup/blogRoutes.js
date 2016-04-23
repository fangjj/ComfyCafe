import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import BlogFeedView from "/imports/ui/views/BlogFeedView";
import BlogUserView from "/imports/ui/views/BlogUserView";
import BlogPostView from "/imports/ui/views/BlogPostView";

const blogRoutes = FlowRouter.group({ prefix: "/b" });

blogRoutes.route("/", {
  name: "blog",
  action: function () {
    setTitle();
    renderView(BlogFeedView);
  }
});

blogRoutes.route("/:username", {
  name: "blogBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Blog");
    renderView(BlogUserView);
  }
});

blogRoutes.route("/:username/:postId", {
  name: "blogPost",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(BlogPostView);
  }
});
