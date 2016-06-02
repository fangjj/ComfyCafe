import _ from "lodash";

function isBanned(user, communityId) {
  if (! user) {
    user = Meteor.user();
  }
  if (! communityId) {
    const ban = _.get(user, "ban");
    if (ban) {
      if (ban <= new Date()) {
        Meteor.users.update(
          { _id: user._id },
          { $unset: { ban: 1 } }
        );
        return null;
      }
    }
    return ban;
  } else {
    const ban = _.get(user, "communityBans." + communityId);
    if (ban) {
      if (ban <= new Date()) {
        const doc = { $unset: {} };
        doc.$unset["communityBans." + communityId] = 1;
        Meteor.users.update({ _id: user._id }, doc);
        return null;
      }
    }
    return ban;
  }
}

export default isBanned;
