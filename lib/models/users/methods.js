Meteor.methods({
	setAvatar: function (avatarId) {
		check(avatarId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			var oldAvatarId = Meteor.user().profile.avatar;
			if (oldAvatarId) {
				// Delete old avatar
				media.remove({ _id: oldAvatarId });
			}

			media.update(
				{ _id: new Mongo.ObjectID(avatarId) },
				{ $set: {
					"metadata.bound": true
				} }
			);
		}

    Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $set: {
				"profile.avatar": new Mongo.ObjectID(avatarId)
    	} }
		);
	},
	deleteAvatar: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (Meteor.isServer) {
			var oldAvatarId = Meteor.user().profile.avatar;
			if (oldAvatarId) {
				// Delete old avatar
				media.remove({ _id: oldAvatarId });
			}
		}

    Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $unset: {
				"profile.avatar": "RIP",
				"profile.avatars": "RIP"
    	} }
		);
	},
	toggleSubscription: function (userId) {
		check(userId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var add = ! _.contains(Meteor.user().profile.subscriptions, userId);

		var op;
		if (add) {
			op = "$push";
		} else {
			op = "$pull";
		}

		var doc = {};
		doc[op] = { "profile.subscriptions": userId };
    Meteor.users.update(
			{ _id: Meteor.userId() },
			doc
		);

		var doc = {};
		doc[op] = { "profile.subscribers": Meteor.userId() };
    Meteor.users.update(
			{ _id: userId },
			doc
		);

		var doc = {};
		doc[op] = { "uploader.profile.subscribers": Meteor.userId() };
		Posts.update(
			{ "uploader._id": userId },
			doc,
			{ multi: true }
		);

		return add;
	}
});
