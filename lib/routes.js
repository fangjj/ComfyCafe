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

Router.route("/", {name: 'home', controller: 'MainController'});

Router.route("/i/:name", function () {
  var params = this.params;
  var name = params.name;

  this.render("post", {
    data: {
      post: function () {
        return [Posts.findOne({name: name})];
      }
    }
  });
}, { name: "post.view", controller: "MainController" });

Router.route("/u/:username", function () {
  var params = this.params;
  var username = params.username;

  this.render("user", {
    data: function () {
      return Meteor.users.findOne({username: username});
    }
  });
}, { name: "user.view", controller: "MainController" });
