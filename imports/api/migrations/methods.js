import _ from "lodash";

import prefixer from "/imports/api/common/prefixer";
import { ownerPrefixer, updateOwnerDocs, profilePrefixer  } from "/imports/api/users/updateProfile";
import Posts from "/imports/api/posts/collection";
import Notifications from "/imports/api/notifications/collection";
import Rooms from "/imports/api/rooms/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import "/imports/api/media/methods";
import media from "/imports/api/media/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import colors from "/imports/api/media/colors";

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
  migrateCommentPerms: migrationBuilder(function () {
    Meteor.users.find().map((user) => {
      Rooms.update(
        {
          system: true,
          "owner._id": user._id
        },
        { $set: {
          requireInvite: true,
          membersOnlyCreate: true
        } }
      );
      logMigrate(user.username);
    });
  }),
  migrateCommPerms: migrationBuilder(function () {
    Rooms.find().map((room) => {
      Roles.setUserRoles(
  			room.owner._id,
  			[ "admin", "moderator", "member" ],
  			"community_" + room.slug
  		);
      logMigrate(room.name);
    });
  }),
  migrateMedia: migrationBuilder(function () {
    media.find(
      {
        "metadata.bound": { $ne: true },
        "metadata.thumbOf": { $exists: true }
      }
    ).map((m) => {
      const parent = media.findOne({ _id: m.metadata.thumbOf });
      if (parent) {
        media.update(
          { _id: m._id },
          { $set: prefixer("metadata", _.pick(parent.metadata, [
            "bound",
            "complete",
            "post",
            "avatarFor"
          ])) }
        );
      }
    });
  }),
  migrateTopicUsers: migrationBuilder(function () {
    Messages.find().map((msg) => {
      Topics.update(
        { _id: msg.topic._id },
        { $addToSet: { users: msg.owner._id } }
      );
    });
  }),
  migrateMembers: migrationBuilder(function () {
    Rooms.find().map((room) => {
      Rooms.update(
        { _id: room._id },
        { $set: { members: [ room.owner._id ] } }
      );
      logMigrate(room.name);
    });
  }),
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
  migrateColor: migrationBuilder(function () {
    Posts.find().map(function (post) {
      if (media.findOne({ _id: post.medium._id })) {
        const type = post.medium.contentType.split("/")[0];
        if (type === "image") {
          Meteor.call("mediumColor", post.medium._id._str);
        } else {
          if (! post.bgColor && ! post.complement) {
            Posts.update(
              { _id: post._id },
              { $set: {
                bgColor: _.sample(colors)
              } }
            );
          }
        }
        logMigrate(post.owner.username + "/" + post.name);
      } else {
        console.log("!!!", post._id, post.name)
      }
    });
	})
});
