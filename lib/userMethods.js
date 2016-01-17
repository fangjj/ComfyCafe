Meteor.methods({
	setAvatar: function (avatarId, state) {
		check(avatarId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    var avatar = avatars.findOne(new Mongo.ObjectID(avatarId));

    console.log(avatar);

    Meteor.users.update({ _id: Meteor.userId() }, { $set: {
      "profile.avatar.md5": avatar.md5
    } });
	}
});
