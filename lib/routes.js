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
  name: "post.all",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("allPosts");
  },
  action: function () {
    setTitle();
    this.render("index", {
      data: {
        posts: function () {
          return Posts.find({}, { sort: { createdAt: -1, name: 1 } });
        }
      }
    });
  }
});

Router.route("/posts", {
  name: "post.list",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("yourPosts");
  },
  action: function () {
    setTitle("Manage Posts");
    this.render("index", {
      data: {
        posts: function () {
          return Posts.find(
            { "uploader._id": Meteor.userId() },
            { sort: { createdAt: -1, name: 1 } }
          );
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
    return Meteor.subscribe("favorites");
  },
  action: function () {
    setTitle("Favorites");
    this.render("favorites", {
      data: {
        posts: function () {
          return Posts.find(
            { favorited: Meteor.userId() },
            { sort: { createdAt: -1, name: 1 } }
          );
        }
      }
    });
  }
});

Router.route("/subscriptions/", {
  name: "subscriptions",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("subscribedPosts");
  },
  action: function () {
    setTitle("Subscriptions");
    this.render("subscriptions", {
      data: {
        posts: function () {
          return Posts.find(
            { "uploader.profile.subscribers": Meteor.userId() },
            { sort: { createdAt: -1, name: 1 } }
          );
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
  name: "profile",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("user", this.params.username);
  },
  action: function () {
    setTitle(this.params.username);
    this.render("profile", {
      data: function () {
        return Meteor.users.findOne({ username: this.params.username });
      }
    });
  }
});

Router.route("/settings", {
  name: "settings",
  fastRender: true,
  loadingTemplate: "loading",
  action: function () {
    setTitle("Settings");
    this.render("settings", {
      data: function () {
        return Meteor.user();
      }
    });
  }
});

Router.route("/:name", {
  name: "post.view",
  fastRender: true,
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("post", this.params.name);
  },
  action: function () {
    setTitle(this.params.name);
    this.render("post", {
      data: function () {
        return Posts.findOne({ name: this.params.name });
      }
    });
  }
});
