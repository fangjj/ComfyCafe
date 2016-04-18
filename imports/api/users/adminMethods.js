import _ from "lodash";

import { updateOwnerDocs, updateProfile } from "/imports/api/users/updateProfile";
import Badges from "../badges/collection";
import adminMethod from "/imports/api/common/adminMethod";

Meteor.methods({
	adminUpdateUser(userId, data) {
		check(userId, String);
		check(data, {
			badges: String
		});

		adminMethod(() => {
			const badges = _.map(commaSplit(data.badges), (badge) => {
				return Badges.findOne({ name: badge });
			});

			updateProfile(
				{ _id: userId },
				{ $set: {
					"profile.badges": badges
				} }
			);
		});
	}
});
