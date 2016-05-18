import _ from "lodash";

function statusInjector(user, statuses) {
  const status = statuses[user._id];
  if (status) {
    user.status = _.clone(status);
  }
}

export default statusInjector;
