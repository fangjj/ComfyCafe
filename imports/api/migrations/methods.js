import _ from "lodash";

import Posts from "../posts/collection";
import BlogPosts from "../blog/collection";
import "../blog/methods";
import "../media/methods";
import media from "../media/collection";
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
      });
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
