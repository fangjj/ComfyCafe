Meteor.methods({
	setAvatar: function (avatarId, state) {
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
	}
});
