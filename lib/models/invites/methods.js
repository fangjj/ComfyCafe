Meteor.methods({
	addInvite: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var invite = new Invite();

    invite.key = uuid.v4();
		invite.uploader = Meteor.userId();

		if (invite.validate()) {
			invite.save();
		}
	},
	deleteInvite: function (key) {
		check(key, String);

		var invite = Invites.findOne({ key: key });

		if (! invite.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Invites.remove(invite._id);
	}
});
