import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import prefixer from "/imports/api/common/prefixer";
import { isMod, isMember } from "/imports/api/common/persimmons";

function baseTopicPub(doc) {
	this.autorun(function (computation) {
		const topics = Topics.find(doc);
		const exists = Boolean(topics.fetch().length);
		if (exists) {
			// Unenforced Invariant: all requested topics have the same room.
			const rooms = Rooms.find(
				{ _id: topics.fetch()[0].room._id },
				{ fields: { slug: 1, membersOnlyView: 1 } }
			);
			const room = rooms.fetch()[0];
			if (room.membersOnlyView && ! isMember(this.userId, "community_" + room.slug)) {
				return this.ready();
			}
			return [ topics, rooms ];
		} else {
			return this.ready();
		}
	});
}

Meteor.publish("topic", function (slug) {
	check(slug, String);
	return baseTopicPub.call(this, { slug });
});

Meteor.publish("topicId", function (id) {
	check(id, String);
	return baseTopicPub.call(this, { _id: id });
});

Meteor.publish("roomTopics", function (slug) {
	check(slug, String);
	this.autorun(function (computation) {
		const room = Rooms.findOne({ slug }, { fields: { slug: 1, membersOnlyView: 1 } });
		if (room.membersOnlyView && ! isMember(this.userId, "community_" + room.slug)) {
			return this.ready();
		}
		return Topics.find(prefixer("room", { slug }));
	});
});

Meteor.publish("directMessageTopics", function () {
	return Topics.find({ relationship: this.userId });
});

Meteor.publish("directMessageTopic", function (username) {
	check(username, String);
	this.autorun(function (computation) {
		const otherUser = Meteor.users.find({ normalizedUsername: username.toLowerCase() });
		const topics = Topics.find(
			{
				relationship: { $all: [ this.userId, otherUser.fetch()[0]._id ] }
			}
		);
		return [ topics, otherUser ];
	});
});

Meteor.publish("modAllTopics", function () {
	if (isMod(this.userId)) {
  	return Topics.find({});
	}
});

Meteor.publish("modTopic", function (topicId) {
  check(topicId, String);
	if (isMod(this.userId)) {
		return Topics.find({ _id: topicId });
	}
});

Meteor.publish("communityModAllTopics", function (slug) {
	check(slug, String);
	if (isMod(this.userId, "community_" + slug)) {
  	return Topics.find(prefixer("room", { slug }));
	}
});

Meteor.publish("communityModTopic", function (slug, topicId) {
  check(slug, String);
  check(topicId, String);
	if (isMod(this.userId, "community_" + slug)) {
		return Topics.find({ _id: topicId, "room.slug": slug });
	}
});
