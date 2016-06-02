import _ from "lodash";

import "/imports/api/users/methods";

function isBirthday(user) {
  if (! user) { user = Meteor.user(); }
  const month = _.get(user, "profile.birthday.month");
  const day = _.get(user, "profile.birthday.day");
  if (month && day) {
    const now = new Date();
    return (
      now.getMonth()+1 === month
      && now.getDate() === day
    );
  }
  return false;
}

function shouldCelebrate(user) {
  if (! user) { user = Meteor.user(); }
  const lastCelebrated = user.lastCelebrated;
  if (lastCelebrated) {
    const now = new Date();
    return now.getYear() !== lastCelebrated;
  }
  return true;
}

function stopCelebrating() {
  const now = new Date();
  const year = now.getYear();
  Meteor.call("stopCelebrating", year);
}

export {
  isBirthday,
  shouldCelebrate,
  stopCelebrating
};
