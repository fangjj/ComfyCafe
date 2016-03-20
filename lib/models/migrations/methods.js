var logMigrate = function (body, note) {
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
  migrateTags: migrationBuilder(function () {
    // Migrating tags would be stupidly hard, so just reset them.
    Posts.find().map(function (post) {
      Posts.update(
        { _id: post._id },
        { $set: {
          tags: tagParser("")
        } }
      );
      logMigrate(post.owner.username + "/" + post.name);
    });
  }),
  migrateOriginality: migrationBuilder(function () {
    Posts.find().map(function (post) {
      var originality = "repost";
      if (post.original) {
        originality = "original";
      }

      Posts.update(
        { _id: post._id },
        { $set: {
          originality: originality
        }, $unset: {
          original: 1
        } }
      );

      logMigrate(post.owner.username + "/" + post.name, originality);
    });
  }),
  migrateWatchers: migrationBuilder(function () {
    // Due to an oversight in migrateComments, I'm now watching all the comment threads!
    // This migration fixes that.
    Posts.find().map(function (post) {
      Topics.update(
        { _id: post.topic._id },
        { $set: {
          watchers: [post.owner._id]
        } }
      );

      logMigrate(post.owner.username + "/" + post.name, post.topic._id);
    });
  }),
  migrateDimensions: migrationBuilder(function () {
    var createImageSizeStream = Meteor.npmRequire("image-size-stream");

    media.find().map(function (medium) {
      if (medium.contentType.split("/")[0] === "image") {
        if (medium.length) {
          var imageSizeStream = createImageSizeStream()
          .on("size", Meteor.bindEnvironment(function (dimensions) {
            media.update(
              { _id: medium._id },
              { $set: {
                "metadata.width": dimensions.width,
                "metadata.height": dimensions.height
              } }
            );

            Posts.update(
              { "medium._id": medium._id },
              { $set: {
                "medium.width": dimensions.width,
                "medium.height": dimensions.height
              } }
            );

            logMigrate(medium._id, dimensions.width + ", " + dimensions.height);
          }));

          media.findOneStream({ _id: medium._id }).pipe(imageSizeStream);
        } else {
          // Why do we have empty files? Good question!
          // I don't know. Just kill them all!
          media.remove({ _id: medium._id });
        }
      }
    });
  }),
	migrateComments: migrationBuilder(function () {
    // Add room to user
    Meteor.users.find().map(function (user) {
      if (! _.has(user, "room")) {
        // Migration is needed!

        var roomId = Rooms.insert(
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActivity: new Date(),
            name: user.username,
            slug: user._id,
            owner: {
              _id: user._id,
              username: user.username,
              profile: user.profile
            },
            system: true,
            topicCount: 0
          }
        );

        Meteor.users.update(
          { _id: user._id },
          { $set: {
            room: {
              _id: roomId
            }
          } }
        );

        logMigrate(user.username, roomId);
      }
    });

    // Add topic to post
    Posts.find().map(function (post) {
      if (! _.has(post, "topic")) {
        // Migration is needed!

        var user = Meteor.users.findOne({ _id: post.owner._id });

        var topicId = Meteor.call("addTopic", user.room._id, {
					name: post.name,
					visibility: post.visibility || "public"
				});

        Posts.update(
          { _id: post._id },
          { $set: {
            visibility: post.visibility || "public",
            topic: {
              _id: topicId
            }
          } }
        );

        logMigrate(post.owner.username + "/" + post.name, topicId);
      }
    });
	})
});
