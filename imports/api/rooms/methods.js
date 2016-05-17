import _ from "lodash";

import Rooms from "/imports/api/rooms/collection";
import Topics from "/imports/api/topics/collection";
import Messages from "/imports/api/messages/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import docBuilder from "/imports/api/common/docBuilder";

const match = {
	name: String,
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

		const doc = docBuilder({
			lastActivity: new Date(),
			topicCount: 0,
			members: [ Meteor.userId() ]
		}, data);
		const roomId = Rooms.insert(doc);

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
        { $set: {
					"topic.room.name": data.name,
					"topic.room.slug": slug
				} },
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
