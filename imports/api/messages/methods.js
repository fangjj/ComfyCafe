import _ from "lodash";

import "/imports/api/topics/methods";
import Messages from "/imports/api/messages/collection";
import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import notificationDispatch from "/imports/api/messages/notificationDispatch";
import docBuilder from "/imports/api/common/docBuilder";

const match = {
  body: String
};

Meteor.methods({
  addMessage(topicId, data) {
    check(topicId, String);
    check(data, match);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    const topic = Topics.findOne(topicId);

    const doc = docBuilder({
      topic: {
        _id: topic._id,
        slug: topic.slug,
        room: {
          _id: topic.room._id,
          slug: topic.room.slug
        }
      }
    }, data);
    const messageId = Messages.insert(doc);

    if (_.get(Meteor.user(), "settings.autoWatch", true)) {
      Meteor.call("watchTopic", topicId);
    }

    Topics.update(
      { _id: topic._id },
      {
        $set: { lastActivity: new Date() },
        $inc: { messageCount: 1 },
        $addToSet: { users: Meteor.userId() }
      }
    );

    Rooms.update(
      { _id: topic.room._id },
      { $set: { lastActivity: new Date() } }
    );

    notificationDispatch(messageId, data, topic, true);
  },
  updateMessage: function (messageId, data) {
    check(messageId, String);
    check(data, match);

    const msg = Messages.findOne(messageId);

    if (! isOwner(msg)) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.update(
      { _id: messageId },
      { $set: _.defaults({
        updatedAt: new Date()
      }, data) }
    );

    Topics.update(
      { _id: msg.topic._id },
      { $set: { lastActivity: new Date() } }
    );

    const topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: { lastActivity: new Date() } }
    );

    notificationDispatch(messageId, data, topic);
  },
  deleteMessage(messageId) {
    check(messageId, String);

    const msg = Messages.findOne(messageId);

    if (! isOwner(msg)) {
			throw new Meteor.Error("not-authorized");
		}

    Messages.remove(messageId);

    if (! Messages.find(
      {
        "topic._id": msg.topic._id,
        "owner._id": Meteor.userId()
      }
    ).fetch().length) {
      doc.$pull = { users: Meteor.userId() };
    }

    Topics.update(
      { _id: msg.topic._id },
      {
        $set: { lastActivity: new Date(), },
        $inc: { messageCount: -1 }
      }
    );

    const topic = Topics.findOne(msg.topic._id);

    Rooms.update(
      { _id: topic.room._id },
      { $set: { lastActivity: new Date() } }
    );
  }
});
