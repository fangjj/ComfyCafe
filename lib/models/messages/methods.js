Meteor.methods({
  addMessage: function (topicId, data) {
    check(topicId, String);
    check(data, {
      body: String
    });

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    var doc = {
      _id: Random.id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      body: data.body,
      owner: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        profile: Meteor.user().profile
      },
      topic: {
        _id: topicId
      }
    };

    Topics.update(
      { _id: topicId },
      { $push: {
        messages: doc
      }, $set: {
        lastActivity: new Date()
      }, $inc: {
        messageCount: 1
      } }
    );

    var topic = Topics.findOne(topicId);

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  },
  updateMessage: function (topicId, messageId, data) {
    check(topicId, String);
    check(messageId, String);
    check(data, {
      body: String
    });

    var topic = Topics.findOne(
      { _id: topicId, messages: { $elemMatch: { _id: messageId } } },
      { fields: { room: 1, messages: 1 } }
    );

    var msg = topic.messages[0];

    if (! msg.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Topics.update(
      { _id: topicId, messages: { $elemMatch: { _id: messageId } } },
      { $set: {
        lastActivity: new Date(),
        "messages.$.updatedAt": new Date(),
        "messages.$.body": data.body
      } }
    );

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  },
  deleteMessage: function (topicId, messageId) {
    check(topicId, String);
    check(messageId, String);

    var topic = Topics.findOne(
      { _id: topicId, messages: { $elemMatch: { _id: messageId } } },
      { fields: { room: 1, messages: 1 } }
    );

    var msg = topic.messages[0];

    if (! msg.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Topics.update(
      { _id: topicId, messages: { $elemMatch: { _id: messageId } } },
      { $set: {
        lastActivity: new Date(),
      }, $pull: {
        messages: { _id: messageId }
      }, $inc: {
        messageCount: -1
      } }
    );

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  }
});
