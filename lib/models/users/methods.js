Meteor.methods({
	applySettings: function (data) {
		check(data, {
			displayName: String,
			blurb: String,
			defaultPage: String,
			nsfwNameGen: Boolean
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"profile.displayName": data.displayName,
				"profile.blurb": data.blurb,
				"profile.defaultPage": data.defaultPage,
				"profile.nsfwNameGen": data.nsfwNameGen
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
					"from._id": Meteor.userId(),
					to: userId,
					msg: "subscribed"
				},
				{ $set: {
					from: {
						_id: Meteor.userId(),
						username: Meteor.user().username
					},
					to: userId,
					msg: "subscribed",
					createdAt: new Date()
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
