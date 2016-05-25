import Messages from "/imports/api/messages/collection";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("topicMessages", function (topicId) {
	check(topicId, String);
	return Messages.find({ "topic._id": topicId });
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

Meteor.publish("communityModAllMessages", function (slug) {
	check(slug, String);
	if (isMod(this.userId, "community_" + slug)) {
		return Messages.find({ "topic.room.slug": slug });
	}
});
