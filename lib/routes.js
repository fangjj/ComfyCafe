import PostFeedView from "./imports/views/PostFeedView";
import BlogUserView from "./imports/views/BlogUserView";
import PostBrowseLikesView from "./imports/views/PostBrowseLikesView";
import BlogFeedView from "./imports/views/BlogFeedView";
import PostBrowseBookmarksView from "./imports/views/PostBrowseBookmarksView";
import PostSearchView from "./imports/views/PostSearchView";
import BlogPostView from "./imports/views/BlogPostView";
import ChatView from "./imports/views/ChatView";
import PostView from "./imports/views/PostView";
import PostBrowseAllView from "./imports/views/PostBrowseAllView";
import LoadingTestView from "./imports/views/LoadingTestView";
import UserSettingsView from "./imports/views/UserSettingsView";
import PostBrowseUserView from "./imports/views/PostBrowseUserView";
import TagTestView from "./imports/views/TagTestView";
import PostUnauthBrowseView from "./imports/views/PostUnauthBrowseView";
import RoomListView from "./imports/views/RoomListView";
import TagListView from "./imports/views/TagListView";
import DummyView from "./imports/views/DummyView";
import TagView from "./imports/views/TagView";
import UserProfileView from "./imports/views/UserProfileView";
import FriendListView from "./imports/views/FriendListView";

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
