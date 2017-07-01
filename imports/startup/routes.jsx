import React from "react";

import render from "/imports/ui/utils/render";
import setTitle from "/imports/ui/utils/setTitle";

import "./adminRoutes";
import "./userRoutes";
import "./imageRoutes";

import Err404 from "/imports/ui/components/Err404";
import PostFeed from "/imports/ui/components/Post/PostFeed";
import PostBrowseAll from "/imports/ui/components/Post/PostBrowseAll";
import PostContainer from "/imports/ui/components/Post/PostContainer";
import Help from "/imports/ui/components/Help";
import About from "/imports/ui/components/About";
import Legal from "/imports/ui/components/Legal";
import Privacy from "/imports/ui/components/Privacy";
import CommunityGuidelines from "/imports/ui/components/CommunityGuidelines";
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
    if (Meteor.userId()) {
      render({ main: <PostFeed /> });
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
    render({ main: <CommunityGuidelines /> });
  }
});

FlowRouter.route("/privacy", {
  name: "privacy",
  action: function () {
    setTitle("Privacy");
    render({ main: <Privacy /> });
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

FlowRouter.route("/:name", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("name"));
    render({ main: <PostContainer /> });
  }
});
