import Rooms from "/imports/api/rooms/collection";
import privacyWrap from "/imports/api/common/privacyWrap";

Meteor.publish("room", function (slug) {
	check(slug, String);
	return Rooms.find({ slug });
});

Meteor.publish("allRooms", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Rooms.find(privacyWrap(
				{ system: { $ne: true } },
				this.userId,
				user.friends
			));
		} else {
			return Rooms.find(
				{
					system: { $ne: true },
					visibility: "public"
				}
			);
		}
	});
});
