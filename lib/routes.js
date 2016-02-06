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
  //loadingTemplate: "loading",
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
  //loadingTemplate: "loading",
  action: function () {
    setTitle();
    BlazeLayout.render("layout", {content: "index"});
  }
});

FlowRouter.route("/posts", {
  name: "yourPosts",
  //loadingTemplate: "loading",
  action: function () {
    setTitle("Manage Posts");
    BlazeLayout.render("layout", {content: "index"});
  }
});

FlowRouter.route("/favorites/", {
  name: "favorites",
  //loadingTemplate: "loading",
  action: function () {
    setTitle("Favorites");
    BlazeLayout.render("layout", {content: "favorites"});
  }
});

FlowRouter.route("/u/:username", {
  name: "profile",
  //loadingTemplate: "loading",
  action: function () {
    setTitle(FlowRouter.getParam("username"));
    BlazeLayout.render("layout", {content: "profile"});
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  //loadingTemplate: "loading",
  action: function () {
    setTitle("Settings");
    BlazeLayout.render("layout", {content: "settings"});
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  //loadingTemplate: "loading",
  action: function () {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    setTitle("Search: " + tagStr);
    BlazeLayout.render("layout", {content: "search"});
  }
});

FlowRouter.route("/p/:postId", {
  name: "post",
  //loadingTemplate: "loading",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    BlazeLayout.render("layout", {content: "post"});
  }
});
