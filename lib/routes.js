// UserAccounts Routes
//AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
//AccountsTemplates.configureRoute("forgotPwd");
//AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

FlowRouter.route("/", {
  name: "feed",
  action: function () {
    setTitle();
    if (Meteor.userId()) {
      renderView(PostFeedView);
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

FlowRouter.route("/blog", {
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

FlowRouter.route("/u/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});

FlowRouter.route("/u/:username/art", {
  name: "artBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Art");
    renderView(PostBrowseUserView);
  }
});

FlowRouter.route("/u/:username/blog", {
  name: "blogBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Blog");
    renderView(DummyView);
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

FlowRouter.route("/a/:postId", {
  name: "postPerma",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(PostView);
  }
});

FlowRouter.route("/a/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});

FlowRouter.route("/b/:postId", {
  name: "blogPostPerma",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(BlogPostView);
  }
});

FlowRouter.route("/b/:username/:postName", {
  name: "blogPost",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(BlogPostView);
  }
});

/*
// Get it? a, b, c...
FlowRouter.route("/c/:roomId", {
  name: "chatRoom",
  action: function () {
    setTitle(FlowRouter.getParam("roomId"));
    renderView(ChatRoomView);
  }
});
*/

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
    renderView(DummyComponent);
  }
});
