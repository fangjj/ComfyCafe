import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import DummyView from "/imports/ui/views/DummyView";

FlowRouter.route("/p/:username", {
  name: "pagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Pages");
    renderView(DummyView);
  }
});
