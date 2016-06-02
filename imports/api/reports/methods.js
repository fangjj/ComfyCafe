import _ from "lodash";

import collectionMap from "/imports/api/common/collectionMap";
import Reports from "/imports/api/reports/collection";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod } from "/imports/api/common/persimmons";
import Rooms from "/imports/api/rooms/collection";

// Types of reports that go to community managers instead of the global staff.
const communityLevel = [ "spam", "offtopic", "other" ];

function isCommunityLevel(data) {
  return _.includes([ "topic", "message" ], data.item.type)
    && _.includes(communityLevel, data.violation);
}

const communityBindMap = {
  topic(item) { return { _id: item.room._id }; },
  message(item) { return { _id: item.topic.room._id }; }
};

function bindToCommunity(data, item) {
  const comm = Rooms.findOne(communityBindMap[data.item.type](item));
  data.community = _.pick(comm, [ "_id", "slug" ]);
}

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

    if (isCommunityLevel(data)) {
      bindToCommunity(data, item);
    }

    Reports.insert(docBuilder({}, data));
  },
	updateReport(reportId, data) {
    check(reportId, String);
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
  forwardToGlobal(reportId) {
    check(reportId, String);

    const report = Reports.findOne(reportId);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    if (! isMod(Meteor.userId(), "community_" + report.community.slug)) {
      throw new Meteor.Error("not-authorized");
    }

    Reports.update(
      { _id: reportId },
      { $unset: { "data.community": 1 } }
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
