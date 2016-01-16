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

Router.route("/", {
  name: "post.list",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("posts");
  },
  action: function () {
    this.render("index", {
      data: {
        posts: function () {
          return Posts.find({}, { sort: { createdAt: -1 } });
        }
      }
    });
  }
});

Router.route("/favorites/", {
  name: "favorites",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return [
      Meteor.subscribe("favorites"),
      Meteor.subscribe("favoriteMedia")
    ];
  },
  action: function () {
    this.render("favorites", {
      data: {
        posts: function () {
          return Posts.find({}, { sort: { createdAt: -1 } });
        }
      }
    });
  }
});

Router.route("/invites/", {
  name: "invites",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("invites");
  },
  action: function () {
    this.render("invites", {
      data: {
        invites: function () {
          return Invites.find();
        }
      }
    });
  }
});

Router.route("/:name", {
  name: "post.view",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return [
      Meteor.subscribe("post", this.params.name),
      Meteor.subscribe("postMedia", this.params.name)
    ];
  },
  action: function () {
    this.render("post", {
      data: function () {
        return {
          post: Posts.findOne(),
          medium: media.findOne({
            "metadata.post": this.params.name,
            "metadata.master": true
          })
        }
      }
    });
  }
});
