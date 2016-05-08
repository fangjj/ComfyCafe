import _ from "lodash";

import collectionMap from "/imports/api/common/collectionMap";
import Reports from "/imports/api/reports/collection";

const match = {
  item: {
    _id: String,
    ownerId: String,
    type: String
  },
  violation: String,
  details: String
};

Meteor.methods({
	addReport(data) {
    check(data, match);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    const item = collectionMap[data.item.type].findOne({ _id: data.item._id });
    if (_.get(item, "owner._id", item._id) !== data.item.ownerId) {
      throw new Meteor.Error("fraud", "Why would you try to deceive me?");
    }

    const reportId = Reports.insert(_.defaults({
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        normalizedUsername: Meteor.user().normalizedUsername,
        profile: Meteor.user().profile
      }
    }, data));
  },
	updateReport(reportId, data) {
    check(data, match);

    const report = Reports.findOne(reportId);

    if (! isOwner(report)) {
      throw new Meteor.Error("not-authorized");
    }

    Reports.update(
      { _id: reportId },
      { $set: _.defaults({
        updatedAt: new Date()
      }, data) }
    );
  }
});
