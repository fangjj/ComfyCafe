import Messages from "/imports/api/messages/collection";

Meteor.publish("topicMessages", function (topicId) {
	check(topicId, String);
	return Messages.find({ "topic._id": topicId });
});
