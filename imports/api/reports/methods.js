import _ from "lodash";

import collectionMap from "/imports/api/common/collectionMap";
import Reports from "/imports/api/reports/collection";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod } from "/imports/api/common/persimmons";

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

    Reports.insert(docBuilder({}, data));
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
  },

  modDeleteReport(reportId) {
    check(reportId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    if (! isMod(Meteor.userId())) {
      throw new Meteor.Error("not-authorized");
    }

    Reports.remove({ _id: reportId });
  }
});
