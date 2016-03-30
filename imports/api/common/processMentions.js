import _ from "lodash";

import mentionRegex from "/imports/api/common/mentionRegex";
import Notifications from "/imports/api/notifications/collection";

export default function (tag, text, data) {
  if (! Meteor.isServer) {
    return;
  }

  var mentions = text.match(mentionRegex);
  _.each(mentions, function (mention) {
    var username = mention.substr(1);
    var user = Meteor.users.findOne({ username: username });
    if (user) {
      var doc = {
        to: user._id,
        action: tag + "Mentioned",
        owner: {
          _id: Meteor.userId(),
          username: Meteor.user().username,
          profile: Meteor.user().profile
        }
      };
      if (data) {
        _.each(data, function (value, key) {
          doc[key] = value;
        });
      }
      var insDoc = _.clone(doc);
      insDoc.createdAt = new Date();
      Notifications.upsert(
        doc,
        { $set: insDoc }
      );
    }
  });
};
