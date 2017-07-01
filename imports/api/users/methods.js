import _ from "lodash";
import "sugar";

import {
	ownerPrefixer,
	updateOwnerDocs,
	profilePrefixer,
	updateProfile
} from "/imports/api/users/updateProfile";
import prefixer from "/imports/api/common/prefixer";
import { validateUsername } from "/imports/api/users/validators";
import media from "/imports/api/media/collection";
import Notifications from "/imports/api/notifications/collection";
import Rooms from "/imports/api/rooms/collection";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod, isAdmin } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";
import isBlocked from "/imports/api/users/isBlocked";

if (Meteor.isServer) {
	mediumValidate = require("/imports/api/media/server/validate").default;
}

const matchProfile = {
	displayName: String,
	blurb: String,
	bio: String,
	birthday: {
		month: Number,
		day: Number
	},
	avatarSafety: Number,
	info: Object,
	infoOrder: [String],
};

function deleteAvatar(userId) {
	if (Meteor.isServer) {
		const user = Meteor.users.findOne({ _id: userId });

		// Delete old avatar
		media.remove(
			{
				"metadata.avatarFor": userId,
				"metadata.djenticon": { $ne: true }
			}
		);

		// Rebind djenticon
		media.update(
			{
				"metadata.owner": userId,
				"metadata.djenticon": true
			},
			{ $set: { "metadata.avatarFor": userId } }
		);
	}

	Meteor.users.update(
		{ _id: userId },
		{ $unset: { avatars: "RIP" } }
	);

	updateOwnerDocs(
		{ "owner._id": userId },
		{ $unset: { "owner.profile.avatar": "RIP" } }
	);
}

Meteor.methods({
	updateProfile(data) {
		check(data, matchProfile);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		updateProfile(
			{ _id: Meteor.userId() },
			{ $set: profilePrefixer(data) }
		);
	},
	modUpdateProfile(userId, data, reason) {
		check(userId, String);
		check(data, matchProfile);
		checkReason(reason);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (! isMod(Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		}

		updateProfile(
			{ _id: userId },
			{ $set: profilePrefixer(data) }
		);

		const user = Meteor.users.findOne({ _id: userId });

		const doc = docBuilder({
			item: {
				_id: userId,
				ownerId: userId,
				type: "user",
				action: "updated",
				url: FlowRouter.path("profile", { username: user.username })
			}
		}, reason);
		ModLog.insert(doc);
	},
	changeUsername(username) {
		check(username, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const valid = validateUsername(username);

		if (! valid) {
			throw new Meteor.Error("invalid-username");
		}

		if (Meteor.isServer) {
			Accounts.setUsername(Meteor.userId(), username);
			const normalizedUsername = username.toLowerCase();
			Meteor.users.update(
				{ _id: Meteor.userId() },
				{ $set: { normalizedUsername } }
			);
			updateOwnerDocs(
				{ "owner._id": Meteor.userId() },
				{ $set: ownerPrefixer({
					username,
					normalizedUsername
				}) }
			);
			Rooms.update(
				{
					system: true,
					"owner._id": Meteor.userId()
				},
				{ $set: {
					name: username
				} }
			);
		}
	},
	updateSettings(data) {
		check(data, {
			username: String,
			uploadAction: String,
			autoWatch: Boolean,
			defaultPublished: Boolean,
			defaultOriginal: Boolean
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (data.username !== Meteor.user().username) {
			Meteor.call("changeUsername", data.username);
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: _.defaults(
				{},
				prefixer("settings", data)
			) }
		);
	},
	setAvatar(avatarId) {
		check(avatarId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			const medium = media.findOne({ _id: new Mongo.ObjectID(avatarId) });
			try {
				mediumValidate(medium._id, "image", Meteor.bindEnvironment((mime, valid) => {
					if (valid) {
						// Delete old avatar
						media.remove(
							{
								"metadata.avatarFor": Meteor.userId(),
								"metadata.djenticon": { $ne: true }
							}
						);

						// Unbind djenticon
						media.update(
							{ "metadata.avatarFor": Meteor.userId() },
							{ $unset: {
								"metadata.avatarFor": "nobody"
							} }
						)

						media.update(
							{ _id: medium._id },
							{ $set: {
								contentType: mime,
								"metadata.bound": true,
								"metadata.complete": true,
								"metadata.avatarFor": Meteor.userId()
							} }
						);

						media.update(
							{ "metadata.thumbOf": medium._id },
							{ $set: {
								"metadata.bound": true,
								"metadata.complete": true,
								"metadata.avatarFor": Meteor.userId()
							} },
							{ multi: true }
						);
					} else {
						media.remove({ _id: medium._id });
						console.error("Invalid medium " + avatarId + " purged. (Invalid)");
						throw new Meteor.Error("invalid-medium");
					}
				}));
			} catch (e) {
				console.error(e);
				media.remove({ _id: medium._id });
				console.error("Invalid medium " + avatarId + " purged. (Caught)");
				throw e;
			}
		}
	},
	deleteAvatar() {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}
		deleteAvatar(Meteor.userId());
	},
	modDeleteAvatar(userId, reason) {
		check(userId, String);
		checkReason(reason);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (! isMod(Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		}

		deleteAvatar(userId);

		const user = Meteor.users.findOne({ _id: userId });

		const doc = docBuilder({
			item: {
				_id: userId,
				ownerId: userId,
				type: "user",
				action: "deletedAvatar",
				url: FlowRouter.path("profile", { username: user.username })
			}
		}, reason);
		ModLog.insert(doc);
	},
	toggleSubscription: function (userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const is_subscribing = ! _.includes(Meteor.user().subscriptions, userId);

		let op;
		if (is_subscribing) {
			op = "$push";
			const notification_exists = Boolean(Notifications.findOne({
				to: userId,
				action: "subscribed",
				"owner._id": Meteor.userId()
			}));
			if (! notification_exists) {
				Notifications.insert({
					createdAt: new Date(),
					to: userId,
					action: "subscribed",
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					}
				});
			}
		} else {
			op = "$pull";
			Notifications.remove(
				{
					to: userId,
					action: "subscribed",
					"owner._id": Meteor.userId()
				}
			);
		}

		{
			let doc = {};
			doc[op] = { subscriptions: userId };
	    Meteor.users.update(
				{ _id: Meteor.userId() },
				doc
			);
		}

		{
			let doc = {};
			doc[op] = { subscribers: Meteor.userId() };
	    Meteor.users.update(
				{ _id: userId },
				doc
			);
		}

		return is_subscribing;
	},

	stopCelebrating(year) {
		check(year, Number);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: { lastCelebrated: year } }
		);
	},

	modBanUser(userId, data, reason) {
		check(userId, String);
		check(data, { ban: String });
		checkReason(reason);

		if (! isMod(Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		}

		// http://sugarjs.com/dates
		const duration = Date.create(data.ban);

		Meteor.users.update(
	    { _id: userId },
	    { $set: { ban: duration } }
	  );

		const user = Meteor.users.findOne({ _id: userId });
		const doc = docBuilder({
			item: {
				_id: userId,
				ownerId: userId,
				type: "user",
				action: "banned",
				url: FlowRouter.path("profile", { username: user.username })
			}
		}, reason);
		ModLog.insert(doc);
	},
	modUnbanUser(userId) {
		check(userId, String);

		if (! isMod(Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(
	    { _id: userId },
	    { $unset: { ban: 1 } }
	  );
	},

	blockUser(userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $addToSet: { blocking: userId } }
		);
	},
	unblockUser(userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: { blocking: userId } }
		);
	}
});
