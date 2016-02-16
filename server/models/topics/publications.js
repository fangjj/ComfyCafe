Meteor.publish("roomTopics", function (roomId) {
	check(roomId, String);
	return Topics.find({ "room._id": roomId });
});
