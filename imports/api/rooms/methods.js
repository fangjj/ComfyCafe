import _ from "lodash";

import Rooms from "/imports/api/rooms/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
	name: String,
	visibility: String,
	description: String,
	rules: String
};

const slugCycle = createSlugCycler(Rooms, true);

Meteor.methods({
	addRoom(data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		data.slug = slugCycle(null, data.name);

		const roomId = Rooms.insert(_.defaults({
			createdAt: new Date(),
			updatedAt: new Date(),
			lastActivity: new Date(),
			owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
				normalizedUsername: Meteor.user().normalizedUsername,
				profile: Meteor.user().profile
			},
			topicCount: 0
		}, data));

		return data.slug;
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
			{ $set: _.defaults({
        updatedAt: new Date()
      }, data) }
		);

		if (Meteor.isServer) {
      const slug = slugCycle(roomId, data.name);
      Rooms.update(
        { _id: roomId },
        { $set: { slug } }
      );
			Topics.update(
				{ "room._id": roomId },
				{ $set: {
					"room.name": data.name,
					"room.slug": slug
				} },
				{ multi: true }
			);
			Messages.update(
        { "topic.room._id": roomId },
        { $set: { "topic.room.slug": topic.room.slug } },
				{ multi: true }
      );
      return slug;
    }
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
