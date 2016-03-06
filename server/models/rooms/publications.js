Meteor.publish("room", function (roomId) {
	check(roomId, String);
	return Rooms.find({ _id: roomId });
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
