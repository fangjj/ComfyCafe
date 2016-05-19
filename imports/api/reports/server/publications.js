import Reports from "/imports/api/reports/collection";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("modAllReports", function () {
  if (isMod(this.userId)) {
    return Reports.find({});
  }
});
