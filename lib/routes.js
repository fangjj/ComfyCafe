// UserAccounts Routes
//AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
//AccountsTemplates.configureRoute("forgotPwd");
//AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

FlowRouter.route("/", {
  name: "home",
  action: function () {
    setTitle();
    if (Meteor.user()) {
      var view = {
        art: PostFeedView,
        blog: BlogFeedView
      }[Meteor.user().profile.defaultPage || "art"];
      renderView(view);
    } else {
      renderView(PostUnauthBrowseView);
    }
  }
});

FlowRouter.route("/explore", {
  name: "explore",
  action: function () {
    setTitle();
    renderView(PostBrowseAllView);
  }
});

FlowRouter.route("/i", {
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

FlowRouter.route("/p", {
  name: "blog",
  action: function () {
    setTitle();
    renderView(BlogFeedView);
  }
});

FlowRouter.route("/likes", {
  name: "likes",
  action: function () {
    setTitle("Likes");
    renderView(PostBrowseLikesView);
  }
});

FlowRouter.route("/friends", {
  name: "friends",
  action: function () {
    setTitle("Friends");
    renderView(DummyView);
  }
});

FlowRouter.route("/u/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});

FlowRouter.route("/u/:username/images", {
  name: "imagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Images");
    renderView(PostBrowseUserView);
  }
});

FlowRouter.route("/u/:username/pages", {
  name: "pagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Pages");
    renderView(PagesUserView);
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action: function () {
    setTitle("Settings");
    renderView(UserSettingsView);
  }
});

FlowRouter.route("/invites/", {
  name: "invites",
  action: function () {
    setTitle("Invites");
    renderView(InviteListView);
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  action: function () {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    setTitle("Search: " + tagStr);
    renderView(PostSearchView);
  }
});

FlowRouter.route("/i/:postId", {
  name: "postPerma",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(PostView);
  }
});

FlowRouter.route("/i/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});

FlowRouter.route("/p/:postId", {
  name: "blogPost",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(BlogPostView);
  }
});

FlowRouter.route("/c", {
  name: "roomList",
  action: function () {
    setTitle("Chat Rooms");
    renderView(RoomListView);
  }
});

FlowRouter.route("/c/:roomId", {
  name: "room",
  action: function () {
    setTitle("Loading Room...");
    renderView(ChatView);
  }
});

FlowRouter.route("/c/:roomId/:topicId", {
  name: "topic",
  action: function () {
    setTitle("Loading Topic...");
    renderView(ChatView);
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
