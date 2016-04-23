import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import TagListView from "/imports/ui/views/TagListView";
import TagTestView from "/imports/ui/views/TagTestView";
import TagView from "/imports/ui/views/TagView";

FlowRouter.route("/tag-test", {
  name: "tagTest",
  action: function () {
    setTitle("Tag Test");
    renderView(TagTestView);
  }
});

const tagRoutes = FlowRouter.group({ prefix: "/t" });

tagRoutes.route("/", {
  name: "tagList",
  action: function () {
    setTitle("Tags");
    renderView(TagListView);
  }
});

tagRoutes.route("/:tagName", {
  name: "tag",
  action: function () {
    setTitle(FlowRouter.getParam("tagName"));
    renderView(TagView);
  }
});
