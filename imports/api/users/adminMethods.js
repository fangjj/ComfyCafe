import _ from "lodash";

import { updateOwnerDocs, updateProfile } from "/imports/api/users/updateProfile";
import Badges from "../badges/collection";
import adminMethod from "/imports/api/common/adminMethod";

Meteor.methods({
	adminUpdateUser(userId, data) {
		check(userId, String);
		check(data, {
			badges: String,
			isAdmin: Boolean,
			isDev: Boolean,
			isMod: Boolean
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

			const roles = [];
			if (data.isAdmin) {
				roles.push("admin");
			}
			if (data.isDev) {
				roles.push("developer");
			}
			if (data.isMod) {
				roles.push("moderator");
			}
			if (roles.length) {
				Roles.addUsersToRoles(userId, roles,  Roles.GLOBAL_GROUP);
			}
			const notRoles = _.difference(["admin", "developer", "moderator"], roles);
			if (notRoles.length) {
				Roles.removeUsersFromRoles(userId, notRoles,  Roles.GLOBAL_GROUP);
			}
		});
	}
});
