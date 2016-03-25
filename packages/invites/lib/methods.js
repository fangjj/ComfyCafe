Meteor.methods({
	addInvite: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		Invites.insert(
			{
				key: uuid.v4(),
				owner: Meteor.userId()
			}
		);
	},
	deleteInvite: function (key) {
		check(key, String);

		var invite = Invites.findOne({ key: key });

		if (invite.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Invites.remove(invite._id);
	}
});
