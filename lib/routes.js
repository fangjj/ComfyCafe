// UserAccounts Routes
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");

FlowRouter.route("/", {
  name: "home",
  action: function () {
    setTitle();
    if (Meteor.user()) {
      var page = Meteor.user().profile.defaultPage || "art";

      var view = {
        art: PostFeedView,
        blog: BlogFeedView
      }[page];

      if (Meteor.isServer) {
        FastRender.route("/", function (params) {
          if (page === "art") {
            this.subscribe("postFeed");
          }
        });
      }

      renderView(view);
    } else {
      renderView(PostUnauthBrowseView);
    }
  }
});

FlowRouter.route("/explore", {
  name: "explore",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/explore", function (params) {
        this.subscribe("allPosts");
      });
    }

    setTitle();
    renderView(PostBrowseAllView);
  }
});

FlowRouter.route("/i", {
  name: "art",
  action: function () {
    setTitle();

    if (Meteor.userId()) {
      if (Meteor.isServer) {
        FastRender.route("/i", function (params) {
          this.subscribe("postFeed");
        });
      }

      renderView(PostFeedView);
    } else {
      if (Meteor.isServer) {
        FastRender.route("/i", function (params) {
          this.subscribe("allPosts");
        });
      }

      renderView(PostUnauthBrowseView);
    }
  }
});

FlowRouter.route("/b", {
  name: "blog",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/b", function (params) {
        this.subscribe("blogFeed");
      });
    }

    setTitle();
    renderView(BlogFeedView);
  }
});

FlowRouter.route("/likes", {
  name: "likes",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/likes", function (params) {
        this.subscribe("likes");
      });
    }

    setTitle("Likes");
    renderView(PostBrowseLikesView);
  }
});

FlowRouter.route("/bookmarks", {
  name: "bookmarks",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/bookmarks", function (params) {
        this.subscribe("bookmarks");
      });
    }

    setTitle("Bookmarks");
    renderView(PostBrowseBookmarksView);
  }
});

FlowRouter.route("/friends", {
  name: "friends",
  action: function () {
    setTitle("Friends");
    renderView(FriendListView);
  }
});

FlowRouter.route("/u/:username", {
  name: "profile",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/u/:username", function (params) {
        this.subscribe("user", params.username);
      });
    }

    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});

FlowRouter.route("/u/:username/images", {
  name: "imagesBy",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/u/:username/images", function (params) {
        this.subscribe("imagesBy", params.username);
      });
    }

    setTitle(FlowRouter.getParam("username") + "'s Images");
    renderView(PostBrowseUserView);
  }
});

FlowRouter.route("/u/:username/blog", {
  name: "blogBy",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/u/:username/blog", function (params) {
        this.subscribe("blogBy", params.username);
      });
    }

    setTitle(FlowRouter.getParam("username") + "'s Blog");
    renderView(BlogUserView);
  }
});

FlowRouter.route("/u/:username/pages", {
  name: "pagesBy",
  action: function () {
    /*
    if (Meteor.isServer) {
      FastRender.route("/u/:username/pages", function (params) {
        this.subscribe("pagesBy", params.username);
      });
    }*/

    setTitle(FlowRouter.getParam("username") + "'s Pages");
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
    if (Meteor.isServer) {
      FastRender.route("/invites", function (params) {
        this.subscribe("invites");
      });
    }

    setTitle("Invites");
    renderView(InviteListView);
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  action: function () {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));

    if (Meteor.isServer) {
      FastRender.route("/q/:rawTagStr", function (params) {
        this.subscribe("searchPosts", rawTagStr);
      });
    }

    setTitle("Search: " + tagStr);
    renderView(PostSearchView);
  }
});

FlowRouter.route("/i/:postId", {
  name: "postPerma",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/i/:postId", function (params) {
        this.subscribe("postPerma", params.postId);
      });
    }

    setTitle(FlowRouter.getParam("postId"));
    renderView(PostView);
  }
});

FlowRouter.route("/i/:username/:postName", {
  name: "post",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/i/:username/:postName", function (params) {
        this.subscribe("post", params.username, params.postName);
      });
    }

    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});

FlowRouter.route("/b/:postId", {
  name: "blogPost",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/b/:postId", function (params) {
        this.subscribe("blogPost", params.postId);
      });
    }

    setTitle(FlowRouter.getParam("postId"));
    renderView(BlogPostView);
  }
});

FlowRouter.route("/c", {
  name: "roomList",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/c", function (params) {
        this.subscribe("allRooms");
      });
    }

    setTitle("Chat Rooms");
    renderView(RoomListView);
  }
});

FlowRouter.route("/c/:roomId", {
  name: "room",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/c/:roomId", function (params) {
        this.subscribe("room", params.roomId);
      });
    }

    setTitle("Loading Room...");
    renderView(ChatView);
  }
});

FlowRouter.route("/c/:roomId/:topicId", {
  name: "topic",
  action: function () {
    if (Meteor.isServer) {
      FastRender.route("/c/:roomId/:topicId", function (params) {
        this.subscribe("topic", params.topicId);
      });
    }

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
