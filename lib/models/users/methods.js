profileSyncList = [Posts, BlogPosts, Rooms, Topics, Messages, Notifications];

Meteor.methods({
	updateProfile: function (data) {
		check(data, {
			displayName: String,
			blurb: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"profile.displayName": data.displayName,
				"profile.blurb": data.blurb
			} }
		);

		_.map(profileSyncList, function (coll) {
			coll.update(
				{ "owner._id": Meteor.userId() },
				{ $set: {
					"owner.profile.displayName": data.displayName,
					"owner.profile.blurb": data.blurb
				} },
				{ multi: true }
			);
		});
	},
	updateSettings: function (data) {
		check(data, {
			defaultPage: String,
			uploadAction: String,
			nsfwNameGen: Boolean,
			autoWatch: Boolean,
			patternSeed: String,
			preservePattern: Boolean
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"settings.defaultPage": data.defaultPage,
				"settings.uploadAction": data.uploadAction,
				"settings.nsfwNameGen": data.nsfwNameGen,
				"settings.autoWatch": data.autoWatch,
				"settings.patternSeed": data.patternSeed,
				"settings.preservePattern": data.preservePattern
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

		var add = ! _.contains(Meteor.user().subscriptions, userId);

		var op;
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

		var doc = {};
		doc[op] = { subscriptions: userId };
    Meteor.users.update(
			{ _id: Meteor.userId() },
			doc
		);

		var doc = {};
		doc[op] = { subscribers: Meteor.userId() };
    Meteor.users.update(
			{ _id: userId },
			doc
		);

		return add;
	}
});
