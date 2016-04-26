import adminPublication from "/imports/api/common/server/adminPublication";
import Reports from "/imports/api/reports/collection";

Meteor.publish("adminAllReports", adminPublication(function () {
  return Reports.find({});
}));
