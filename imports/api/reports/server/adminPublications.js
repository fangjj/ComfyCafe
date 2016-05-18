import adminPublication from "/imports/api/common/server/adminPublication";
import Reports from "/imports/api/reports/collection";

Meteor.publish("adminAllReports", adminPublication(function () {
  return Reports.find({});
}));

Meteor.publish("adminReport", function (clientUserId, id) {
  check(clientUserId, Match.Optional(String));
  check(id, String);

  if (clientUserId === this.userId) {
    this.autorun(function (computation) {
      const isAdmin = Roles.userIsInRole(this.userId, ["admin"], Roles.GLOBAL_GROUP);
      if (isAdmin) {
        return Reports.find({ _id: id });
      } else {
        console.log("You're just a poser!");
      }
    });
  }
});
