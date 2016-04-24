import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import { tagStrFromUrl } from "/imports/api/tags/urlify";
import PostView from "/imports/ui/views/PostView";
import PostFeedView from "/imports/ui/views/PostFeedView";
import PostBrowseAllView from "/imports/ui/views/PostBrowseAllView";
import PostBrowseBookmarksView from "/imports/ui/views/PostBrowseBookmarksView";
import PostBrowseLikesView from "/imports/ui/views/PostBrowseLikesView";
import PostBrowseUserView from "/imports/ui/views/PostBrowseUserView";
import PostSearchView from "/imports/ui/views/PostSearchView";

FlowRouter.route("/explore", {
  name: "explore",
  action: function () {
    setTitle();
    renderView(PostBrowseAllView);
  }
});

FlowRouter.route("/likes", {
  name: "likes",
  action: function () {
    setTitle("Likes");
    renderView(PostBrowseLikesView);
  }
});

FlowRouter.route("/bookmarks", {
  name: "bookmarks",
  action: function () {
    setTitle("Bookmarks");
    renderView(PostBrowseBookmarksView);
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  action: function () {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    setTitle("Search: " + tagStr);
    renderView(PostSearchView);
  }
});

const imageRoutes = FlowRouter.group({ prefix: "/i" });

imageRoutes.route("/", {
  name: "art",
  action: function () {
    setTitle();

    if (Meteor.userId()) {
      renderView(PostFeedView);
    } else {
      renderView(PostUnauthBrowseView);
    }
  }
});

imageRoutes.route("/:username", {
  name: "imagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Images");
    renderView(PostBrowseUserView);
  }
});

imageRoutes.route("/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});
