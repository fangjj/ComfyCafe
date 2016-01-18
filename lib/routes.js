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
    setTitle();
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
    setTitle("Favorites");
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
    setTitle("Invites");
    this.render("invites", {
      data: {
        invites: function () {
          return Invites.find();
        }
      }
    });
  }
});

Router.route("/u/:username", {
  name: "user.view",
  fastRender: true,
  loadingTemplate: "loading",
  action: function () {
    setTitle(this.params.username);
    this.render("profile", {
      data: function () {
        return Meteor.users.findOne({ username: this.params.username });
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
    setTitle(this.params.name);
    this.render("post", {
      data: function () {
        return {
          post: Posts.findOne(),
          medium: media.findOne(
            {
              "metadata.post": this.params.name,
              "metadata.thumbnails": { $exists: true }
            }
          )
        }
      }
    });
  }
});
