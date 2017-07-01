import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";
import PostBrowseLikes from "/imports/ui/components/Post/PostBrowseLikes";
import PostFeed from "/imports/ui/components/Post/PostFeed";

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
