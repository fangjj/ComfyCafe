Meteor.methods({
  addMessage: function (topicId, data) {
    check(topicId, String);
    check(data, {
      body: String
    });

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Messages.insert({
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
    });

    if (Meteor.user().settings.autoWatch) {
      Meteor.call("watchTopic", topicId);
    }

    Topics.update(
      { _id: topicId },
      { $set: {
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

    _.each(topic.watchers, function (watcherId) {
      Notifications.insert(
        {
          createdAt: new Date(),
          to: watcherId,
          action: "topicPosted",
          owner: {
            _id: Meteor.userId(),
            username: Meteor.user().username,
            profile: Meteor.user().profile
          },
          topic: {
            _id: topicId,
            name: topic.name
          }
        }
      );
    });
  },
  updateMessage: function (messageId, data) {
    check(messageId, String);
    check(data, {
      body: String
    });

    var msg = Messages.findOne(messageId);

    if (! msg.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.update(
      { _id: messageId },
      { $set: {
        updatedAt: new Date(),
        body: data.body
      } }
    );

    Topics.update(
      { _id: msg.topic._id },
      { $set: {
        lastActivity: new Date()
      } }
    );

    var topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  },
  deleteMessage: function (messageId) {
    check(messageId, String);

    var msg = Messages.findOne(messageId);

    if (! msg.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.remove(messageId);

    Topics.update(
      { _id: msg.topic._id },
      { $set: {
        lastActivity: new Date(),
      }, $inc: {
        messageCount: -1
      } }
    );

    var topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: {
        lastActivity: new Date()
      } }
    );
  }
});
