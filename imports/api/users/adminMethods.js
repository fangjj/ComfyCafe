import _ from "lodash";

import { updateOwnerDocs, updateProfile } from "/imports/api/users/updateProfile";
import media from "/imports/api/media/collection";
import adminMethod from "/imports/api/common/adminMethod";

if (Meteor.isServer) {
	generateDjenticon = require("/imports/api/users/server/djenticon").default;
}

Meteor.methods({
	adminUpdateUser(userId, data) {
		check(userId, String);
		check(data, {
			isAdmin: Boolean,
			isDev: Boolean,
			isMod: Boolean
		});

		adminMethod(() => {
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
			Roles.setUserRoles(userId, roles,  Roles.GLOBAL_GROUP);
		});
	},
	adminDjentRegen() {
		adminMethod(() => {
			Meteor.users.find().map((user) => {
				const currentAvatar = media.findOne({ "metadata.avatarFor": user._id });
				const isDjented = currentAvatar && Boolean(currentAvatar.metadata.djenticon);

				generateDjenticon(user._id, CryptoJS.SHA256(user.emails[0].address).toString());

				if (! isDjented) {
					// Unbind djenticon
					media.update(
						{ "metadata.avatarFor": user._id },
						{ $unset: { "metadata.avatarFor": 1 } }
					);
				}
			});
		});
	}
});
