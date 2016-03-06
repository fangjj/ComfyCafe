var logMigrate = function (body, note) {
  console.log("[MIGRATED] " + body + " (" + note + ")");
};

Meteor.methods({
	migrateComments: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    if (Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
      if (Meteor.isServer) {
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
      }
    } else {
      throw new Meteor.Error("not-authorized");
    }
	}
});
