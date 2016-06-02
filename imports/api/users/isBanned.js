import _ from "lodash";

function isBanned(user, communityId) {
  if (! user) {
    user = Meteor.user();
  }
  if (! communityId) {
    return _.has(user, "ban");
  } else {
    return _.get(user, "communityBans." + communityId);
  }
}

export default isBanned;
