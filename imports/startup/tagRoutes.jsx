import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/api/common/setTitle";

import TagTest from "/imports/ui/components/Tag/TagTest";
import TagList from "/imports/ui/components/Tag/TagList";
import Tag from "/imports/ui/components/Tag/Tag";

FlowRouter.route("/tag-test", {
  name: "tagTest",
  action: function () {
    setTitle("Tag Test");
    render({ main: <TagTest /> });
  }
});

const tagRoutes = FlowRouter.group({ prefix: "/t" });

tagRoutes.route("/", {
  name: "tagList",
  action: function () {
    setTitle("Tags");
    render({ main: <TagList /> });
  }
});

tagRoutes.route("/:tagName", {
  name: "tag",
  action: function () {
    setTitle(FlowRouter.getParam("tagName"));
    render({ main: <Tag /> });
  }
});
