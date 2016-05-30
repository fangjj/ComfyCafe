import _ from "lodash";

import Messages from "/imports/api/messages/collection";
import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import { isMod, isMember } from "/imports/api/common/persimmons";

Meteor.publish("topicMessages", function (topicId) {
	check(topicId, String);
	this.autorun(function (computation) {
		const topic = Topics.findOne(
			{ _id: topicId },
			{ fields: { room: 1 } }
		);
		const room = Rooms.findOne(
			{ _id: topic.room._id },
			{ fields: { slug: 1, membersOnlyView: 1 } }
		);
		if (room.membersOnlyView && ! isMember(this.userId, "community_" + room.slug)) {
			return null;
		}
		return Messages.find({ "topic._id": topicId });
	});
});

Meteor.publish("directMessages", function (topicId) {
	check(topicId, String);
	this.autorun(function (computation) {
		const topic = Topics.findOne(
			{ _id: topicId },
			{ fields: { relationship: 1 } }
		);
		if (_.includes(topic.relationship, this.userId)) {
			return Messages.find({ "topic._id": topicId });
		} return this.ready();
	});
});

Meteor.publish("modAllMessages", function () {
	if (isMod(this.userId)) {
  	return Messages.find({});
	}
});

Meteor.publish("modMessage", function (messageId) {
  check(messageId, String);
	if (isMod(this.userId)) {
		return Messages.find({ _id: messageId });
	}
});

Meteor.publish("communityModMessage", function (slug, messageId) {
	check(slug, String);
	check(messageId, String);
	if (isMod(this.userId, "community_" + slug)) {
		return Messages.find({ _id: messageId, "topic.room.slug": slug });
	}
});

Meteor.publish("communityModAllMessages", function (slug) {
	check(slug, String);
	if (isMod(this.userId, "community_" + slug)) {
		return Messages.find({ "topic.room.slug": slug });
	}
});
