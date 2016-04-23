import renderView from "/imports/api/common/renderView";
import setTitle from "/imports/api/common/setTitle";
import { tagStrFromUrl } from "/imports/api/tags/urlify";

import AdminView from "/imports/ui/views/AdminView";
import AlbumView from "/imports/ui/views/AlbumView";
import AlbumListView from "/imports/ui/views/AlbumListView";
import BlogFeedView from "/imports/ui/views/BlogFeedView";
import BlogPostView from "/imports/ui/views/BlogPostView";
import BlogUserView from "/imports/ui/views/BlogUserView";
import ChatView from "/imports/ui/views/ChatView";
import DummyView from "/imports/ui/views/DummyView";
import Err404View from "/imports/ui/views/Err404View";
import FriendListView from "/imports/ui/views/FriendListView";
import InviteListView from "/imports/ui/views/InviteListView";
import LoadingTestView from "/imports/ui/views/LoadingTestView";
import LoginView from "/imports/ui/views/LoginView";
import PostBrowseAllView from "/imports/ui/views/PostBrowseAllView";
import PostBrowseBookmarksView from "/imports/ui/views/PostBrowseBookmarksView";
import PostBrowseLikesView from "/imports/ui/views/PostBrowseLikesView";
import PostBrowseUserView from "/imports/ui/views/PostBrowseUserView";
import PostFeedView from "/imports/ui/views/PostFeedView";
import PostSearchView from "/imports/ui/views/PostSearchView";
import PostUnauthBrowseView from "/imports/ui/views/PostUnauthBrowseView";
import PostView from "/imports/ui/views/PostView";
import RoomListView from "/imports/ui/views/RoomListView";
import TagListView from "/imports/ui/views/TagListView";
import TagTestView from "/imports/ui/views/TagTestView";
import TagView from "/imports/ui/views/TagView";
import UserProfileView from "/imports/ui/views/UserProfileView";
import UserSettingsView from "/imports/ui/views/UserSettingsView";

if (Meteor.isServer) {
  FastRender.onAllRoutes(function (path) {
    if (Meteor.userId()) {
      this.subscribe("user", Meteor.user().username);
      this.subscribe("notifications", Meteor.userId());
      this.subscribe("mediaQueue", Meteor.userId());
    }
  });
}

FlowRouter.notFound = {
  action() {
    setTitle("404");
    renderView(Err404View);
  }
};

FlowRouter.route("/", {
  name: "home",
  action: function () {
    setTitle();
    if (Meteor.user()) {
      const page = Meteor.user().profile.defaultPage || "art";

      const view = {
        art: PostFeedView,
        blog: BlogFeedView
      }[page];

      renderView(view);
    } else {
      renderView(PostUnauthBrowseView);
    }
  }
});

FlowRouter.route("/login", {
  name: "login",
  action: function () {
    setTitle("Login");
    renderView(LoginView);
  }
});

FlowRouter.route("/register", {
  name: "register",
  action: function () {
    setTitle("Register");
    renderView(LoginView);
  }
});

FlowRouter.route("/admin", {
  name: "admin",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
  }
});

FlowRouter.route("/admin/:panel", {
  name: "adminPanel",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
  }
});

FlowRouter.route("/admin/:panel/:id", {
  name: "adminView",
  action: function () {
    setTitle("Admin Panel");
    renderView(AdminView);
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

FlowRouter.route("/i/:username", {
  name: "imagesBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Images");
    renderView(PostBrowseUserView);
  }
});

FlowRouter.route("/a/:username", {
  name: "albumsBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Albums");
    renderView(AlbumListView);
  }
});

FlowRouter.route("/b/:username", {
  name: "blogBy",
  action: function () {
    setTitle(FlowRouter.getParam("username") + "'s Blog");
    renderView(BlogUserView);
  }
});

FlowRouter.route("/p/:username", {
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

FlowRouter.route("/i/:username/:postName", {
  name: "post",
  action: function () {
    setTitle(FlowRouter.getParam("postName"));
    renderView(PostView);
  }
});

FlowRouter.route("/a/:username/:albumSlug", {
  name: "album",
  action: function () {
    setTitle(FlowRouter.getParam("albumSlug"));
    renderView(AlbumView);
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
