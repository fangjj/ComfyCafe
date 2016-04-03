import Topics from "./collection";
import Rooms from "../rooms/collection";
import Notifications from "../notifications/collection";

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

    if (room.system && Meteor.userId() !== room.owner._id) {
      if (! Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
        throw new Meteor.Error("not-authorized");
      }
    }

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
        messageCount: 0,
        watchers: [
          Meteor.userId()
        ]
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

    if (! isOwner(topic)) {
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