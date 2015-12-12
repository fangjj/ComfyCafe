Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: "loading"
});

/*
Router.plugin("ensureSignedIn", {
  only: ["private"]
});
*/

//UserAccounts Routes
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");


MainController = RouteController.extend({
  fastRender: true,
});

Router.route("/", {name: "home", controller: "MainController"});

Router.route("/i/", function () {
  this.wait(Meteor.subscribe("posts"));
  this.render("index", {
    data: {
      posts: function () {
        return Posts.find();
      }
    }
  });
}, { name: "post.list", controller: "MainController" });

Router.route("/i/:name", function () {
  var params = this.params;
  var name = params.name;

  this.wait(Meteor.subscribe("post", name));
  var post = Posts.findOne();

  if (typeof post !== "undefined") {
    this.wait(Meteor.subscribe("medium", name));

    this.render("post", {
      data: function () {
        return post;
      }
    });
  } else {
    this.render("404");
  }
}, { name: "post.view", controller: "MainController" });

Router.route("/invites/", function () {
  this.wait(Meteor.subscribe("invites"));
  this.render("invites", {
    data: {
      invites: function () {
        return Invites.find();
      }
    }
  });
}, { name: "invites", controller: "MainController" });
