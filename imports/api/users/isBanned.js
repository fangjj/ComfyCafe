import _ from "lodash";

function isBanned(user) {
  if (! user) {
    user = Meteor.user();
  }
  return _.has(user, "ban");
}

export default isBanned;
