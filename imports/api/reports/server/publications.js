import Reports from "/imports/api/reports/collection";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("modAllReports", function () {
  if (isMod(this.userId)) {
    return Reports.find({ community: { $exists: false } });
  }
});

Meteor.publish("communityModAllReports", function (slug) {
  check(slug, String);
  if (isMod(this.userId, "community_" + slug)) {
    return Reports.find({ "community.slug": slug });
  }
});
