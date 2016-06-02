import _ from "lodash";

function isBlocked(user, otherUserId) {
  return _.includes(user.blocking, otherUserId);
}

export default isBlocked;
