Meteor.methods({
	addRoom: function (data) {
		check(data, {
			name: String,
			visibility: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var roomId = Rooms.insert(
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				lastActivity: new Date(),
				name: data.name,
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				},
				visibility: data.visibility,
				topicCount: 0
			}
		);
		return roomId;
	},
	updateRoom: function (roomId, data) {
		check(roomId, String);
		check(data, {
      name: String,
			visibility: String
		});

		var room = Rooms.findOne(roomId);

		if (! isOwner(room)) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.update(
			{ _id: roomId },
			{ $set: {
				updatedAt: new Date(),
        name: data.name,
				visibility: data.visibility
			} }
		);

		Topics.update(
			{ "room._id": roomId },
			{ $set: {
				"room.name": data.name
			} },
			{ multi: true }
		);
	},
	deleteRoom: function (roomId) {
		check(roomId, String);

		var room = Rooms.findOne(roomId);

		if (! isOwner(room)) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.remove(roomId);
	}
});
