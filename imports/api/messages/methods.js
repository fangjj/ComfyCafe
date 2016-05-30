import _ from "lodash";

import "/imports/api/topics/methods";
import Messages from "/imports/api/messages/collection";
import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import Notifications from "/imports/api/notifications/collection";
import notificationDispatch from "/imports/api/messages/notificationDispatch";
import docBuilder from "/imports/api/common/docBuilder";
import { isMod, isMember } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";
import { dmRoom } from "/imports/api/rooms/dmRoom";
import { dmTopic, dmTopicBuilder } from "/imports/api/topics/dmTopic";

const match = {
  body: String
};

function updateMessage(messageId, data, auth) {
  const msg = Messages.findOne(messageId);

  auth(msg);

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

  return msg;
}

function deleteMessage(messageId, auth) {
  const msg = Messages.findOne(messageId);

  auth(msg);

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

  return msg;
}

function modUpdateDocBuilder(messageId, msg, reason) {
  return docBuilder({
    item: {
      _id: messageId,
      ownerId: msg.owner._id,
      type: "message",
      action: "updated",
      url: FlowRouter.path("topic", {
        roomSlug: _.get(msg, "topic.room.slug"),
        topicSlug: _.get(msg, "topic.slug")
      }) + "#" + messageId
    }
  }, reason);
}

function modDeleteDocBuilder(messageId, msg, reason) {
  return docBuilder({
    item: {
      _id: messageId,
      ownerId: msg.owner._id,
      type: "message",
      action: "deleted"
    }
  }, reason);
}

Meteor.methods({
  addMessage(topicId, data) {
    check(topicId, String);
    check(data, match);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    const topic = Topics.findOne(topicId);
    const room = Rooms.findOne(topic.room._id);

    if (room.membersOnlyPost && ! isMember(Meteor.userId(), "community_" + room.slug)) {
      throw new Meteor.Error("not-authorized");
    }

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
  updateMessage(messageId, data) {
    check(messageId, String);
    check(data, match);
    updateMessage(messageId, data, (msg) => {
      if (! isOwner(msg)) {
        throw new Meteor.Error("not-authorized");
      }
    });
  },
  modUpdateMessage(messageId, data, reason) {
    check(messageId, String);
    check(data, match);
    checkReason(reason);

    const msg = updateMessage(messageId, data, (msg) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId())) {
        throw new Meteor.Error("not-authorized");
      }
    });

    const doc = modUpdateDocBuilder(messageId, msg, reason);
    ModLog.insert(doc);
  },
  communityModUpdateMessage(messageId, data, reason) {
    check(messageId, String);
    check(data, match);
    checkReason(reason);

    const msg = updateMessage(messageId, data, (msg) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId(), "community_" + msg.topic.room.slug)) {
        throw new Meteor.Error("not-authorized");
      }
    });

    const doc = modUpdateDocBuilder(messageId, msg, reason);
    doc.community = _.pick(msg.topic.room, [ "_id", "slug" ]);
    ModLog.insert(doc);
  },
  deleteMessage(messageId) {
    check(messageId, String);
    deleteMessage(messageId, (msg) => {
      if (! isOwner(msg)) {
        throw new Meteor.Error("not-authorized");
      }
    });
  },
  modDeleteMessage(messageId, reason) {
    check(messageId, String);
    checkReason(reason);

    const msg = deleteMessage(messageId, (msg) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId())) {
        throw new Meteor.Error("not-authorized");
      }
    });

    const doc = modDeleteDocBuilder(messageId, msg, reason);
		ModLog.insert(doc);
  },
  communityModDeleteMessage(messageId, reason) {
    check(messageId, String);
    checkReason(reason);

    const msg = deleteMessage(messageId, (msg) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId(), "community_" + msg.topic.room.slug)) {
        throw new Meteor.Error("not-authorized");
      }
    });

    const doc = modDeleteDocBuilder(messageId, msg, reason);
    doc.community = _.pick(msg.topic.room, [ "_id", "slug" ]);
		ModLog.insert(doc);
  },

  addDirectMessage(username, data) {
    check(username, String);
    check(data, match);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    const topicId = expr(() => {
      const topic = dmTopic(username);
      if (! topic) {
        return dmTopicBuilder(username);
      } return topic._id;
    });

    const roomId = dmRoom()._id;

    const doc = docBuilder({
      topic: {
        _id: topicId,
        room: { _id: roomId }
      }
    }, data);
    const messageId = Messages.insert(doc);

    Topics.update(
      { _id: topicId },
      {
        $set: { lastActivity: new Date() },
        $inc: { messageCount: 1 }
      }
    );

    // notify recipient: "x sent you a direct message."
    Notifications.insert(docBuilder(
      {
        to: Meteor.users.findOne({ normalizedUsername: username.toLowerCase() })._id,
        action: "directMessaged",
        message: { _id: messageId },
        topic: { _id: topicId }
      }
    ));
  },
  updateDirectMessage(messageId, data) {
    check(messageId, String);
    check(data, match);

    const message = Messages.findOne({ _id: messageId });

    if (! isOwner(message)) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.update(
      { _id: messageId },
      { $set: _.defaults({
        updatedAt: new Date()
      }, data) }
    );

    Topics.update(
      { _id: message.topic._id },
      { $set: { lastActivity: new Date() } }
    );
  },
  deleteDirectMessage(messageId) {
    check(messageId, String);

    const message = Messages.findOne({ _id: messageId });

    if (! isOwner(message)) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.remove({ _id: messageId });

    Topics.update(
      { _id: message.topic._id },
      { $inc: { messageCount: -1 } }
    );

    Notifications.remove({ "message._id": messageId });
  }
});
