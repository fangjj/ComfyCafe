import adminPublication from "/imports/api/common/server/adminPublication";

Meteor.publish("adminAllUsers", adminPublication(function () {
  return Meteor.users.find({});
}));
