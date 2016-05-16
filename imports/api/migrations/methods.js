import _ from "lodash";

import prefixer from "/imports/api/common/prefixer";
import { ownerPrefixer, updateOwnerDocs, profilePrefixer  } from "/imports/api/users/updateProfile";
import Posts from "/imports/api/posts/collection";
import BlogPosts from "/imports/api/blog/collection";
import Pages from "/imports/api/pages/collection";
import Albums from "/imports/api/albums/collection";
import Filters from "/imports/api/filters/collection";
import Notifications from "/imports/api/notifications/collection";
import Rooms from "/imports/api/rooms/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import "/imports/api/blog/methods";
import "/imports/api/media/methods";
import media from "/imports/api/media/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";

function logMigrate(body, note) {
  console.log("[MIGRATED] " + body + " (" + note + ")");
};

function migrationBuilder(functionBody) {
  return function () {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    if (Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
      if (Meteor.isServer) {
        functionBody();
      }
    } else {
      throw new Meteor.Error("not-authorized");
    }
  };
}

Meteor.methods({
  migrateTopics: migrationBuilder(function () {
    const slugCycle = createSlugCycler(Topics, true);
    Topics.find().map((topic) => {
      const slug = slugCycle(topic._id, topic.name, { "room.slug": topic.room.slug });
      Topics.update(
        { _id: topic._id },
        { $set: { slug } }
      );
      Messages.update(
        { "topic._id": topic._id },
        { $set: {
          "topic.slug": slug,
          "topic.room._id": topic.room._id,
          "topic.room.slug": topic.room.slug
        } },
        { multi: true }
      );
      logMigrate(topic.name, slug);
    });
  }),
  migrateCommunities: migrationBuilder(function () {
    const slugCycle = createSlugCycler(Rooms, true);
    Rooms.find().map((room) => {
      const slug = slugCycle(room._id, room.name);
      const fdoc = { _id: room._id };
      const udoc = { slug };
      Rooms.update(
        fdoc,
        { $set: udoc }
      );
      Topics.update(
        prefixer("room", fdoc),
        { $set: prefixer("room", udoc) },
        { multi: true }
      );
      logMigrate(room.name, slug);
    });
  }),
  migrateNotifications: migrationBuilder(function () {
    Notifications.remove(
      {
        action: { $in: [
          "topicPosted",
          "topicMentioned",
          "postCommented",
          "postCommentMentioned",
          "albumCommented",
          "albumCommentMentioned",
          "pageCommented",
          "pageCommentMentioned",
          "blogCommented",
          "blogCommentMentioned",
        ] },
        message: { $exists: false }
      }
    );
  }),
  migrateUserFilters: migrationBuilder(function () {
    Meteor.users.find().map((user) => {
      const id = _.get(user, "settings.defaultFilter");
      const defaultFilter = Filters.findOne({ _id: id });
      Meteor.users.update(
        { _id: user._id },
        { $set: { defaultFilter } }
      );
      updateOwnerDocs(
				{ "owner._id": user._id },
				{ $set: ownerPrefixer({
					"profile.avatarSafety": user.profile.avatarSafety
				}) }
			);
    });
  }),
  migrateUsers: migrationBuilder(function () {
    Meteor.users.find().map(function (user) {
      const imageCount = Posts.find({ "owner._id": user._id }).count();
      const blogCount = BlogPosts.find({ "owner._id": user._id }).count();
      const pageCount = Pages.find({ "owner._id": user._id }).count();
      const albumCount = Albums.find({ "owner._id": user._id }).count();
      const doc = profilePrefixer({
        imageCount,
        blogCount,
        pageCount,
        albumCount
      });
      const normalizedUsername = user.username.toLowerCase();
      doc.normalizedUsername = normalizedUsername;
      Meteor.users.update(
        { _id: user._id },
        { $set: doc }
      );
      updateOwnerDocs(
				{ "owner._id": user._id },
				{ $set: ownerPrefixer({
					normalizedUsername
				}) }
			);
    });
  }),
  migrateMedia: migrationBuilder(function () {
    media.update(
      { "metadata.bound": true },
      { $set: {
        "metadata.complete": true
      } },
      { multi: true }
    );
  }),
  migrateBlog: migrationBuilder(function () {
    const slugCycle = createSlugCycler(BlogPosts);
    BlogPosts.find().map(function (post) {
      const user = Meteor.users.findOne({ _id: post.owner._id });
      if (! post.slug) {
        post.name = "Untitled";
        post.slug = slugCycle(post._id, post.name);
      }
      const topicId = Meteor.call("addTopic", user.room._id, {
        name: post.name,
        visibility: post.visibility
      }, true);
      BlogPosts.update(
        { _id: post._id },
        { $set: {
          name: post.name,
          slug: post.slug,
          "topic._id": topicId
        } }
      );
      logMigrate(post.owner.username + "/" + post.name, post.slug);
    });
	}),
  migrateColor: migrationBuilder(function () {
    Posts.find().map(function (post) {
      if (media.findOne({ _id: post.medium._id })) {
        Meteor.call("mediumColor", post.medium._id._str);
        logMigrate(post.owner.username + "/" + post.name);
      } else {
        console.log("!!!", post._id, post.name)
      }
    });
	})
});
