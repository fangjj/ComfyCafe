import _ from "lodash";

import Badges from "./collection";
import adminMethod from "/imports/api/common/adminMethod";
import { updateProfile } from "/imports/api/users/updateProfile";

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

      updateProfile(
        { "profile.badges": { $elemMatch: {
          _id: badgeId
        } } },
        { $set: {
          "profile.badges.$" : dataWithId
        } }
      );
    });
  }
});
