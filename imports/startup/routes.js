import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";

import "./adminRoutes";
import "./userRoutes";
import "./imageRoutes";
import "./albumRoutes";
import "./blogRoutes";
import "./pageRoutes";
import "./chatRoutes";
import "./tagRoutes";
import "./filterRoutes";
import "./inviteRoutes";

import BlogFeedView from "/imports/ui/views/BlogFeedView";
import DummyView from "/imports/ui/views/DummyView";
import Err404View from "/imports/ui/views/Err404View";
import LoadingTestView from "/imports/ui/views/LoadingTestView";
import PostFeedView from "/imports/ui/views/PostFeedView";
import PostBrowseAllView from "/imports/ui/views/PostBrowseAllView";

if (Meteor.isServer) {
  FastRender.onAllRoutes(function (path) {
    if (Meteor.userId()) {
      this.subscribe("user", Meteor.user().username);
      this.subscribe("notifications", Meteor.userId());
      this.subscribe("mediaQueue", Meteor.userId());
    }
  });
}

FlowRouter.notFound = {
  action() {
    setTitle("404");
    renderView(Err404View);
  }
};

FlowRouter.route("/", {
  name: "home",
  action: function () {
    setTitle();
    if (Meteor.user()) {
      const page = Meteor.user().profile.defaultPage || "art";

      const view = {
        art: PostFeedView,
        blog: BlogFeedView
      }[page];

      renderView(view);
    } else {
      renderView(PostBrowseAllView);
    }
  }
});

FlowRouter.route("/loading", {
  name: "loading",
  action: function () {
    setTitle("Loading");
    renderView(LoadingTestView);
  }
});

FlowRouter.route("/pizza", {
  name: "pizza",
  action: function () {
    setTitle("Top Secret Pop Punk Pizza Party");
    renderView(DummyView);
  }
});
