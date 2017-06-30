import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";
import PostBrowseLikes from "/imports/ui/components/Post/PostBrowseLikes";
import PostFeed from "/imports/ui/components/Post/PostFeed";
import PostBrowseUser from "/imports/ui/components/Post/PostBrowseUser";
import PostContainer from "/imports/ui/components/Post/PostContainer";

FlowRouter.route("/explore", {
  name: "explore",
  action: function () {
    setTitle();
    render({ main: <PostBrowseAll /> });
  }
});

FlowRouter.route("/likes", {
  name: "likes",
  action: function () {
    setTitle("Likes");
    render({ main: <PostBrowseLikes /> });
  }
});

const imageRoutes = FlowRouter.group({ prefix: "/i" });

imageRoutes.route("/", {
  name: "art",
  action: function () {
    setTitle();
    if (Meteor.userId()) {
      render({ main: <PostFeed /> });
    } else {
      render({ main: <PostBrowseAll /> });
    }
  }
});

imageRoutes.route("/:username", {
  name: "imagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Images");
    render({ main: <PostBrowseUser /> });
  }
});

imageRoutes.route("/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    render({ main: <PostContainer /> });
  }
});
