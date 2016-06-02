import Invites from "./collection";
import isBanned from "/imports/api/users/isBanned";

Meteor.methods({
	addInvite: function () {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		if (isBanned()) {
      throw new Meteor.Error("banned");
    }

		if (Meteor.isServer) {
			Invites.insert(
				{
					key: uuid.v4(),
					owner: Meteor.userId()
				}
			);
		}
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
