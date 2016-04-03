import Posts from "../posts/collection";

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
  migrateInfo: migrationBuilder(function () {
    Meteor.users.update(
      {},
      { $unset: {
        "profile.info": 1
      } },
      { multi: true }
    );
	}),
  migrateTagCapitalization: migrationBuilder(function () {
    Posts.find().map(function (post) {
      var tags = tagRegenerator(post.tags);
      Posts.update(
        { _id: post._id },
        { $set: {
          tags: tags
        } }
      );
      logMigrate(post.owner.username + "/" + post.name, tags.text);
    });
	})
});
