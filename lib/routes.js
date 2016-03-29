import PostFeedView from "./views/PostFeedView.jsx";
import BlogUserView from "./views/BlogUserView.jsx";
import PostBrowseLikesView from "./views/PostBrowseLikesView.jsx";
import BlogFeedView from "./views/BlogFeedView.jsx";
import PostBrowseBookmarksView from "./views/PostBrowseBookmarksView.jsx";
import PostSearchView from "./views/PostSearchView.jsx";
import BlogPostView from "./views/BlogPostView.jsx";
import ChatView from "./views/ChatView.jsx";
import PostView from "./views/PostView.jsx";
import PostBrowseAllView from "./views/PostBrowseAllView.jsx";
import LoadingTestView from "./views/LoadingTestView.jsx";
import UserSettingsView from "./views/UserSettingsView.jsx";
import PostBrowseUserView from "./views/PostBrowseUserView.jsx";
import TagTestView from "./views/TagTestView.jsx";
import PostUnauthBrowseView from "./views/PostUnauthBrowseView.jsx";
import RoomListView from "./views/RoomListView.jsx";
import TagListView from "./views/TagListView.jsx";
import DummyView from "./views/DummyView.jsx";
import TagView from "./views/TagView.jsx";
import UserProfileView from "./views/UserProfileView.jsx";
import FriendListView from "./views/FriendListView.jsx";

if (Meteor.isServer) {
  FastRender.onAllRoutes(function (path) {
    if (Meteor.userId()) {
      this.subscribe("user", Meteor.user().username);
      this.subscribe("media", Meteor.userId());
      this.subscribe("jobs", Meteor.userId());
      this.subscribe("notifications", Meteor.userId())
    }
  });
}

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

      renderView(view);
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

FlowRouter.route("/i", {
  name: "art",
  action: function () {
    setTitle();

    if (Meteor.userId()) {
      renderView(PostFeedView);
    } else {
      renderView(PostUnauthBrowseView);
    }
  }
});

FlowRouter.route("/b", {
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

FlowRouter.route("/bookmarks", {
  name: "bookmarks",
  action: function () {
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
    setTitle(FlowRouter.getParam("username"));
    renderView(UserProfileView);
  }
});

FlowRouter.route("/u/:username/images", {
  name: "imagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Images");
    renderView(PostBrowseUserView);
  }
});

FlowRouter.route("/u/:username/blog", {
  name: "blogBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Blog");
    renderView(BlogUserView);
  }
});

FlowRouter.route("/u/:username/pages", {
  name: "pagesBy",
  action: function () {
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
    setTitle("Invites");
    renderView(InviteListView);
  }
});

FlowRouter.route("/q/:rawTagStr", {
  name: "search",
  action: function () {
    const tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    setTitle("Search: " + tagStr);
    renderView(PostSearchView);
  }
});

FlowRouter.route("/i/:postId", {
  name: "postPerma",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(PostView);
  }
});

FlowRouter.route("/i/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});

FlowRouter.route("/b/:postId", {
  name: "blogPost",
  action: function () {
    setTitle(FlowRouter.getParam("postId"));
    renderView(BlogPostView);
  }
});

FlowRouter.route("/c", {
  name: "roomList",
  action: function () {
    setTitle("Chat Rooms");
    renderView(RoomListView);
  }
});

FlowRouter.route("/t", {
  name: "tagList",
  action: function () {
    setTitle("Tags");
    renderView(TagListView);
  }
});

FlowRouter.route("/t/:tagName", {
  name: "tag",
  action: function () {
    setTitle(FlowRouter.getParam("tagName"));
    renderView(TagView);
  }
});

FlowRouter.route("/tag-test", {
  name: "tagTest",
  action: function () {
    setTitle("Tag Test");
    renderView(TagTestView);
  }
});

FlowRouter.route("/c/:roomId", {
  name: "room",
  action: function () {
    setTitle("Loading Room...");
    renderView(ChatView);
  }
});

FlowRouter.route("/c/:roomId/:topicId", {
  name: "topic",
  action: function () {
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
