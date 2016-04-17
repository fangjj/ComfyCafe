import _ from "lodash";

import Badges from "./collection";
import adminMethod from "/imports/api/common/adminMethod";
import profileSyncList from "/imports/api/users/syncList";

const match = {
  icon: String,
  name: String,
  type: String
};

Meteor.methods({
  addBadge(data) {
    check(data, match);

    adminMethod(() => {
      data.type = data.type.toLowerCase();
      Badges.insert(data);
    });
  },
  updateBadge(badgeId, data) {
    check(badgeId, String);
    check(data, match);

    adminMethod(() => {
      data.type = data.type.toLowerCase();

      Badges.update(
        { _id: badgeId },
        { $set: data }
      );

      const dataWithId = _.defaults(data, { _id: badgeId });

      Meteor.users.update(
        { "profile.badges": { $elemMatch: {
          _id: badgeId
        } } },
        { $set: {
          "profile.badges.$" : dataWithId
        } },
        { multi: true }
      );

      _.map(profileSyncList, (coll) => {
				coll.update(
          { "owner.profile.badges": { $elemMatch: {
            _id: badgeId
          } } },
          { $set: {
            "owner.profile.badges.$" : dataWithId
          } },
					{ multi: true }
				);
			});
    });
  }
});
