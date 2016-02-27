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

    var room = Rooms.findOne(roomId);

		var topicId = Topics.insert(
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				lastActivity: new Date(),
        room: {
          _id: roomId,
          name: room.name
        },
				name: data.name,
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				},
				visibility: data.visibility,
        messageCount: 0
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
  },
  updateTopic: function (topicId, data) {
		check(topicId, String);
		check(data, {
      name: String,
			visibility: String
		});

		var topic = Topics.findOne(topicId);

		if (! topic.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Topics.update(
			{ _id: topicId },
			{ $set: {
				updatedAt: new Date(),
        name: data.name,
				visibility: data.visibility
			} }
		);
	},
  deleteTopic: function (topicId) {
    check(topicId, String);

    var topic = Topics.findOne(topicId);

    if (! topic.owner._id === Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Topics.remove(topicId);

    Rooms.update(
      { _id: topic.room._id },
      { $inc: {
        topicCount: -1
      } }
    );
  },

  startTyping: function (topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $pull: {
        typing: {
          _id: Meteor.userId()
        }
      } }
    );

		Topics.update(
			{ _id: topicId },
			{ $push: {
        typing: {
          _id: Meteor.userId(),
          username: Meteor.user().username,
          profile: Meteor.user().profile
        }
			} }
		);
  },
  stopTyping: function (topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $pull: {
        typing: {
          _id: Meteor.userId()
        }
      } }
    );
  }
});
