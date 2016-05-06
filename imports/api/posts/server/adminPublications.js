import Posts from "/imports/api/posts/collection";
import adminPublication from "/imports/api/common/server/adminPublication";

Meteor.publish("adminAllPosts", adminPublication(function () {
  return Posts.find({});
}));

Meteor.publish("adminPost", function (clientUserId, postId) {
  check(clientUserId, Match.Optional(String));
  check(postId, String);

  if (clientUserId === this.userId) {
    this.autorun(function (computation) {
      const isAdmin = Roles.userIsInRole(this.userId, ["admin"], Roles.GLOBAL_GROUP);
      if (isAdmin) {
        return Posts.find({ _id: postId });
      } else {
        console.log("You're just a poser!");
      }
    });
  }
});
