import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

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

import Err404 from "/imports/ui/components/Err404";
import PostFeed from "/imports/ui/components/Post/PostFeed";
import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";
import BlogListContainer from "/imports/ui/components/Blog/BlogListContainer";
import Help from "/imports/ui/components/Help";
import Rules from "/imports/ui/components/Rules";
import About from "/imports/ui/components/About";
import Legal from "/imports/ui/components/Legal";
import ModLogContainer from "/imports/ui/components/ModLog/ModLogContainer";
import CommunityModLogContainer from "/imports/ui/components/ModLog/CommunityModLogContainer";
import DummyComponent from "/imports/ui/components/DummyComponent";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";

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
    render({ main: <Err404 /> });
  }
};

FlowRouter.route("/", {
  name: "home",
  action: function () {
    setTitle();
    if (Meteor.user()) {
      const page = Meteor.user().settings.defaultPage || "art";

      if (page === "blog") {
        render({ main: <BlogListContainer /> });
      } else {
        render({ main: <PostFeed /> });
      }
    } else {
      render({ main: <PostBrowseAll /> });
    }
  }
});

FlowRouter.route("/help", {
  name: "help",
  action: function () {
    setTitle("Help");
    render({ main: <Help /> });
  }
});

FlowRouter.route("/about", {
  name: "about",
  action: function () {
    setTitle("About");
    render({ main: <About /> });
  }
});

FlowRouter.route("/legal", {
  name: "legal",
  action: function () {
    setTitle("Terms of Service");
    render({ main: <Legal /> });
  }
});

FlowRouter.route("/guidelines", {
  name: "guidelines",
  action: function () {
    setTitle("Community Guidelines");
    render({ main: <Rules /> });
  }
});

FlowRouter.route("/privacy", {
  name: "privacy",
  action: function () {
    setTitle("Privacy");
    render({ main: <Legal /> });
  }
});

FlowRouter.route("/modlog", {
  name: "modlog",
  action: function () {
    setTitle("Moderation Log");
    render({ main: <ModLogContainer /> });
  }
});

FlowRouter.route("/modlog/:roomSlug", {
  name: "communityModlog",
  action: function () {
    setTitle("Moderation Log");
    render({ main: <CommunityModLogContainer /> });
  }
});

FlowRouter.route("/loading", {
  name: "loading",
  action: function () {
    setTitle("Loading");
    render({ main: <LoadingSpinner /> });
  }
});

FlowRouter.route("/pizza", {
  name: "pizza",
  action: function () {
    setTitle("Top Secret Pop Punk Pizza Party");
    render({ main: <DummyComponent /> });
  }
});
