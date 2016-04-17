import _ from "lodash";

import profileSyncList from "./syncList";
import {
	validateUsername
} from "./validators";
import media from "../media/collection";
import Notifications from "../notifications/collection";
import adminMethod from "/imports/api/common/adminMethod";

Meteor.methods({
	updateProfile(data) {
		check(data, {
			info: Object,
			infoOrder: [String],
			displayName: String,
			blurb: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"profile.info": data.info,
				"profile.infoOrder": data.infoOrder,
				"profile.displayName": data.displayName,
				"profile.blurb": data.blurb
			} }
		);

		_.map(profileSyncList, function (coll) {
			coll.update(
				{ "owner._id": Meteor.userId() },
				{ $set: {
					"owner.profile.info": data.info,
					"owner.profile.displayName": data.displayName,
					"owner.profile.blurb": data.blurb
				} },
				{ multi: true }
			);
		});
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
			_.map(profileSyncList, function (coll) {
				coll.update(
					{ "owner._id": Meteor.userId() },
					{ $set: {
						"owner.username": username
					} },
					{ multi: true }
				);
			});
		}
	},
	updateSettings(data) {
		check(data, {
			username: String,
			defaultPage: String,
			defaultFilter: String,
			uploadAction: String,
			autoWatch: Boolean,
			patternSeed: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (data.username !== Meteor.user().username) {
			Meteor.call("changeUsername", data.username);
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"settings.defaultPage": data.defaultPage,
				"settings.defaultFilter": data.defaultFilter,
				"settings.uploadAction": data.uploadAction,
				"settings.autoWatch": data.autoWatch,
				"settings.patternSeed": data.patternSeed
			} }
		);
	},
	setAvatar: function (avatarId) {
		check(avatarId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			if (Meteor.user().avatars) {
				var oldAvatarId = Meteor.user().avatars.fullsize._id;
				if (oldAvatarId) {
					// Delete old avatar
					media.remove({ _id: oldAvatarId });
				}
			}

			// Unbind djenticon
			media.update(
				{ "metadata.avatarFor": Meteor.userId() },
				{ $unset: {
					"metadata.avatarFor": "nobody"
				} }
			)

			media.update(
				{ _id: new Mongo.ObjectID(avatarId) },
				{ $set: {
					"metadata.bound": true,
					"metadata.avatarFor": Meteor.userId()
				} }
			);
		}
	},
	deleteAvatar: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			var oldAvatarId = Meteor.user().avatars.fullsize._id;
			if (oldAvatarId) {
				// Delete old avatar
				media.remove({ _id: oldAvatarId });
			}

			// Rebind djenticon
			media.update(
				{
					"metadata.owner": Meteor.userId(),
					"metadata.djenticon": true
				},
				{ $set: {
					"metadata.avatarFor": Meteor.userId()
				} }
			)
		}

    Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $unset: { avatars: "RIP" } }
		);

		_.map(profileSyncList, function (coll) {
			coll.update(
				{ "owner._id": Meteor.userId() },
				{ $unset: {
					"owner.profile.avatar": "RIP"
				} },
				{ multi: true }
			);
		});
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

	adminUpdateUser(userId, data) {
		check(userId, String);
		check(data, {
			badges: String
		});

		adminMethod(() => {
			Meteor.users.update(
				{ _id: userId },
				{ $set: {
					"profile.badges": commaSplit(data.badges)
				} }
			);
		});
	}
});
