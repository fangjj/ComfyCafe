import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import Messages from "/imports/api/messages/collection";
import Notifications from "/imports/api/notifications/collection";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
  name: String,
  visibility: String
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

		const topicId = Topics.insert(_.defaults({
			createdAt: new Date(),
			updatedAt: new Date(),
			lastActivity: new Date(),
      room: {
        _id: roomId,
        name: room.name,
        slug: room.slug
      },
			owner: {
				_id: Meteor.userId(),
				username: Meteor.user().username,
        normalizedUsername: Meteor.user().normalizedUsername,
				profile: Meteor.user().profile
			},
      messageCount: 0,
      watchers: [ Meteor.userId() ]
		}, data));

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
  deleteTopic: function (topicId) {
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

  watchTopic: function (topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $addToSet: {
        watchers: Meteor.userId()
      } }
    );
  },
  unwatchTopic: function (topicId) {
    check(topicId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    Topics.update(
      { _id: topicId },
      { $pull: {
        watchers: Meteor.userId()
      } }
    );
  },
  viewTopic: function (topicId) {
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
