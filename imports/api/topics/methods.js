import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import Messages from "/imports/api/messages/collection";
import Notifications from "/imports/api/notifications/collection";
import docBuilder from "/imports/api/common/docBuilder";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
  name: String
};

const slugCycle = createSlugCycler(Topics, true);

Meteor.methods({
  addTopic: function (roomId, data, retId) {
    check(roomId, String);
    check(data, match);
    check(retId, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    const room = Rooms.findOne(roomId);

    if (room.system && Meteor.userId() !== room.owner._id) {
      if (! Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
        throw new Meteor.Error("not-authorized");
      }
    }

    data.slug = slugCycle(null, data.name, { "room.slug": room.slug });

    const doc = docBuilder({
      lastActivity: new Date(),
      room: {
        _id: roomId,
        name: room.name,
        slug: room.slug
      },
      messageCount: 0,
      watchers: [ Meteor.userId() ]
    }, data);
		const topicId = Topics.insert(doc);

    Rooms.update(
      { _id: roomId },
      { $set: {
        lastActivity: new Date()
      }, $inc: {
        topicCount: 1
      } }
    );

    if (retId) {
      return topicId;
    }
		return data.slug;
  },
  updateTopic: function (topicId, data) {
		check(topicId, String);
		check(data, match);

		const topic = Topics.findOne(topicId);

    if (! isOwner(topic)) {
			throw new Meteor.Error("not-authorized");
		}

    Topics.update(
      { _id: topicId },
      { $set: _.defaults({
        updatedAt: new Date()
      }, data) }
    );

    if (Meteor.isServer) {
      const slug = slugCycle(topicId, data.name, { "room.slug": topic.room.slug });
      Topics.update(
        { _id: topicId },
        { $set: { slug } }
      );
      Messages.update(
        { "topic._id": topicId },
        { $set: { "topic.slug": slug } },
        { multi: true }
      );
      return slug;
    }
	},
  deleteTopic(topicId) {
    check(topicId, String);

    const topic = Topics.findOne(topicId);

    if (! isOwner(topic)) {
      throw new Meteor.Error("not-authorized");
    }

    Topics.remove(topicId);

    Rooms.update(
      { _id: topic.room._id },
      { $inc: {
        topicCount: -1
      } }
    );

    Notifications.remove({ "topic._id": topicId });
  },

  watchTopic(topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $addToSet: { watchers: Meteor.userId() } }
    );
  },
  unwatchTopic(topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $pull: { watchers: Meteor.userId() } }
    );
  },
  viewTopic(topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Notifications.remove(
      {
        to: Meteor.userId(),
        "topic._id": topicId
      }
    );
  },

  startTyping(topicId) {
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
  stopTyping(topicId) {
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
