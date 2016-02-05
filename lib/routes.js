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
  name: "feed",
  loadingTemplate: "loading",
  waitOn: function () {
    if (Meteor.userId()) {
      return Meteor.subscribe("postFeed");
    } else {
      return Meteor.subscribe("allPosts");
    }
  },
  action: function () {
    setTitle();
    if (Meteor.userId()) {
      this.render("feed", {
        data: {
          posts: function () {
            return Posts.find(
              { $or: [
                { "uploader._id": Meteor.userId() },
                { "uploader._id": { $in: Meteor.user().subscriptions || [] } }
              ] },
              { sort: { createdAt: -1, name: 1 } }
            );
          }
        }
      });
    } else {
      this.render("index", {
        data: {
          posts: function () {
            return Posts.find(
              { },
              { sort: { createdAt: -1, name: 1 }
            });
          }
        }
      });
    }
  }
});

Router.route("/browse", {
  name: "browse",
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("allPosts");
  },
  action: function () {
    setTitle();
    this.render("index", {
      data: {
        posts: function () {
          return Posts.find(
            { },
            { sort: { createdAt: -1, name: 1 }
          });
        }
      }
    });
  }
});

Router.route("/posts", {
  name: "yourPosts",
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

Router.route("/u/:username", {
  name: "profile",
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

Router.route("/q/:rawTagStr", {
  name: "search",
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("searchPosts", tagStrFromUrl(this.params.rawTagStr));
  },
  action: function () {
    var tagStr = tagStrFromUrl(this.params.rawTagStr);
    setTitle("Search: " + tagStr);
    this.render("search", {
      data: {
        posts: function () {
          return queryTags(tagStr);
        }
      }
    });
  }
});

Router.route("/p/:postId", {
  name: "post",
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("post", this.params.postId);
  },
  action: function () {
    setTitle(this.params.postId);
    this.render("post", {
      data: function () {
        return Posts.findOne({ _id: this.params.postId });
      }
    });
  }
});
