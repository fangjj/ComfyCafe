// UserAccounts Routes
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

FlowRouter.route("/", {
  name: "feed",
  action: function () {
    setTitle();
    if (Meteor.userId()) {
      BlazeLayout.render("layout", {content: "feed"});
    } else {
      BlazeLayout.render("layout", {content: "index"});
    }
  }
});

FlowRouter.route("/browse", {
  name: "browse",
  action: function () {
    setTitle();
    ReactLayout.render(MainLayout, {
      content: <BrowsePostsComponent />,
      // Handle this better!
      fab: <UploadFAB />
    });
  }
});

FlowRouter.route("/posts", {
  name: "yourPosts",
  action: function () {
    setTitle("Manage Posts");
    BlazeLayout.render("layout", {content: "index"});
  }
});

FlowRouter.route("/u/:username", {
  name: "profile",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    BlazeLayout.render("layout", {content: "profile"});
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action: function () {
    setTitle("Settings");
    BlazeLayout.render("layout", {content: "settings"});
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  action: function () {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    setTitle("Search: " + tagStr);
    BlazeLayout.render("layout", {content: "search"});
  }
});

FlowRouter.route("/p/:postId", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    BlazeLayout.render("layout", {content: "post"});
  }
});

FlowRouter.route("/react/:postId", {
  name: "react",
  action: function () {
    setTitle();
    ReactLayout.render(MainLayout, {
      content: <PostComponent />
    });
  }
});
