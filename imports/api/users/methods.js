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
import Filters from "/imports/api/filters/collection";
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
			defaultPage: String,
			defaultFilter: String,
			uploadAction: String,
			autoWatch: Boolean,
			defaultImageVisibility: String,
			defaultImageOriginality: String,
			defaultAlbumVisibility: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (data.username !== Meteor.user().username) {
			Meteor.call("changeUsername", data.username);
		}

		const defaultFilter = Filters.findOne({ _id: data.defaultFilter });

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: _.defaults(
				{ defaultFilter },
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

		const add = ! _.includes(Meteor.user().subscriptions, userId);

		let op;
		if (add) {
			op = "$push";
			Notifications.upsert(
				{
					to: userId,
					action: "subscribed",
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					}
				},
				{ $set: {
					createdAt: new Date(),
					to: userId,
					action: "subscribed",
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					}
				} });
		} else {
			op = "$pull";
			Notifications.remove(
				{
					"from._id": Meteor.userId(),
					to: userId,
					msg: "subscribed"
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

		return add;
	},

	sendFriendRequest: function (userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const otherUser = Meteor.users.findOne({ _id: userId });
		if (isBlocked(otherUser, Meteor.userId())) {
			throw new Meteor.Error("blocked");
		}

		Notifications.upsert(
			{
				to: userId,
				action: "friendRequest",
				"owner_.id": Meteor.userId()
			},
			{ $set: {
				createdAt: new Date(),
				to: userId,
				action: "friendRequest",
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				}
			} }
		);
	},
	cancelFriendRequest: function (reqId) {
		check(reqId, String);

		var req = Notifications.findOne({
			_id: reqId,
			action: "friendRequest"
		});

		if (! isOwner(req)) {
			throw new Meteor.Error("not-authorized");
		}

		Notifications.remove({ _id: reqId });
	},
	acceptFriendRequest: function (reqId) {
		check(reqId, String);

		var req = Notifications.findOne(
			{
				_id: reqId,
				action: "friendRequest"
			});

		if (req.to !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $addToSet: {
				friends: req.owner._id
			} }
		);

		Meteor.users.update(
			{ _id: req.owner._id },
			{ $addToSet: {
				friends: Meteor.userId()
			} }
		);

		Notifications.update(
			{ _id: reqId },
			{ $set: {
				dismissed: true
			} }
		);

		Notifications.insert(
			{
				createdAt: new Date(),
				to: req.owner._id,
				action: "friendAccepted",
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				}
			}
		);
	},
	rejectFriendRequest: function (reqId) {
		// This method isn't currently very useful...

		check(reqId, String);

		var req = Notifications.findOne({
			_id: reqId,
			action: "friendRequest"
		});

		if (req.to !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Notifications.update(
			{ _id: reqId },
			{ $set: {
				dismissed: true
			} }
		);

		Notifications.insert(
			{
				createdAt: new Date(),
				to: req.owner._id,
				action: "friendRejected",
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				}
			}
		);
	},
	unfriend: function (userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: {
				friends: userId
			} }
		);

		Meteor.users.update(
			{ _id: userId },
			{ $pull: {
				friends: Meteor.userId()
			} }
		);

		Notifications.remove(
			{
				action: "friendRequest",
				$or: [
					{
						to: Meteor.userId(),
						"owner._id": userId
					},
					{
						to: userId,
						"owner._id": Meteor.userId()
					}
				]
			}
		);
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

	communityUpdateMemberRoles(slug, userId, data) {
		check(slug, String);
		check(userId, String);
		check(data, {
			isAdmin: Boolean,
			isMod: Boolean,
			isMember: Boolean
		});

		const group = "community_" + slug;

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    if (! isAdmin(Meteor.userId(), group)) {
      throw new Meteor.Error("not-authorized");
    }

		const roles = [];
		if (data.isAdmin) {
			roles.push("admin");
		}
		if (data.isMod) {
			roles.push("moderator");
		}
		if (data.isMember) {
			roles.push("member");
		}
		Roles.setUserRoles(userId, roles, group);
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
	communityModBanUser(userId, communitySlug, data, reason) {
		check(userId, String);
		check(communitySlug, String);
		check(data, { ban: String });
		checkReason(reason);

		const community = Rooms.findOne({ slug: communitySlug });

		if (! isMod(Meteor.userId(), "community_" + community.slug)) {
			throw new Meteor.Error("not-authorized");
		}

		const duration = Date.create(data.ban);

		const doc = { $set: {} };
		doc.$set["communityBans." + community._id] = duration;
		Meteor.users.update({ _id: userId }, doc);

		const user = Meteor.users.findOne({ _id: userId });
		const logDoc = docBuilder({
			item: {
				_id: userId,
				ownerId: userId,
				type: "user",
				action: "banned",
				url: FlowRouter.path("profile", { username: user.username })
			}
		}, reason);
		logDoc.community = _.pick(community, [ "_id", "slug" ]);
		ModLog.insert(logDoc);
	},
	communityModUnbanUser(userId, communitySlug) {
		check(userId, String);
		check(communitySlug, String);

		const community = Rooms.findOne({ slug: communitySlug });

		if (! isMod(Meteor.userId(), "community_" + community.slug)) {
			throw new Meteor.Error("not-authorized");
		}

		const doc = { $unset: {} };
		doc.$unset["communityBans." + community._id] = 1;
		Meteor.users.update({ _id: userId }, doc);
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
