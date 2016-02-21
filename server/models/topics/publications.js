Meteor.publish("topic", function (topicId) {
	check(topicId, String);
	return Topics.find({ _id: topicId });
});

Meteor.publish("roomTopics", function (roomId) {
	check(roomId, String);
	return Topics.find({ "room._id": roomId });
});
