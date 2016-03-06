Meteor.publish("topic", function (topicId) {
	check(topicId, String);
	return Topics.find({ _id: topicId });
});

Meteor.publish("roomTopics", function (roomId) {
	check(roomId, String);

	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Topics.find(privacyWrap(
				{ "room._id": roomId },
				this.userId,
				user.friends
			));
		} else {
			return Topics.find(
				{
					"room._id": roomId,
					visibility: "public"
				}
			);
		}
	});
});
