import Rooms from "./collection";

import Topics from "../topics/collection";

const match = {
	name: String,
	visibility: String,
	description: String,
	rules: String
};

Meteor.methods({
	addRoom(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		const roomId = Rooms.insert(
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
				description: data.description,
				rules: data.rules,
				topicCount: 0
			}
		);
		return roomId;
	},
	updateRoom(roomId, data) {
		check(roomId, String);
		check(data, match);

		const room = Rooms.findOne(roomId);

		if (! isOwner(room)) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.update(
			{ _id: roomId },
			{ $set: {
				updatedAt: new Date(),
        name: data.name,
				visibility: data.visibility,
				description: data.description,
				rules: data.rules
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
	deleteRoom(roomId) {
		check(roomId, String);

		const room = Rooms.findOne(roomId);

		if (! isOwner(room)) {
			throw new Meteor.Error("not-authorized");
		}

		Rooms.remove(roomId);
	}
});
