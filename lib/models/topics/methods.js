Meteor.methods({
  addTopic: function (roomId, data) {
    check(roomId, String);
    check(data, {
      name: String,
      visibility: String
    });

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var topicId = Topics.insert(
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				lastActivity: new Date(),
        room: {
          _id: roomId
        },
				name: data.name,
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				},
				visibility: data.visibility
			}
		);

    Rooms.update(
      { _id: roomId },
      { $set: {
        lastActivity: new Date()
      }, $inc: {
        topicCount: 1
      } }
    );

		return topicId;
  }
});
