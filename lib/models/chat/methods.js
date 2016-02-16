Meteor.methods({
	addRoom: function (data) {
		check(data, {
			visibility: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var name;
		nameCycle(Rooms, Meteor.user().profile.nsfwNameGen, function (n) {
			name = n;

			var roomId = Rooms.insert(
				{
					createdAt: new Date(),
					updatedAt: new Date(),
					lastActivity: new Date(),
					name: name,
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					},
					visibility: data.visibility
				}
			);
		});

		return name;
	},
	updateRoom: function (roomId, data) {
		check(roomId, String);
		check(data, {
			visibility: String
		});

		var room = Rooms.findOne(roomId);

		if (! room.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.update(
			{ _id: roomId },
			{ $set: {
				updatedAt: new Date(),
				visibility: data.visibility
			} }
		);
	},
	rerollRoom: function (roomId) {
		check(roomId, String);

		var room = Rooms.findOne(roomId);
		var oldName = room.name;

		if (! room.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var name;
		nameCycle(Meteor.user().profile.nsfwNameGen, function (n) {
			name = n;
			Rooms.update(
				{ _id: roomId },
				{ $set: {
					name: name
				} }
			);
		});

		return name;
	},
	deleteRoom: function (roomId) {
		check(roomId, String);

		var room = Rooms.findOne(roomId);

		if (! room.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.remove(roomId);
	}
});
