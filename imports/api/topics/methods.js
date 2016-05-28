import _ from "lodash";

import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import Messages from "/imports/api/messages/collection";
import Notifications from "/imports/api/notifications/collection";
import docBuilder from "/imports/api/common/docBuilder";
import createSlugCycler from "/imports/api/common/createSlugCycler";
import { isMod, isMember } from "/imports/api/common/persimmons";
import checkReason from "/imports/api/common/checkReason";
import ModLog from "/imports/api/modlog/collection";

const match = {
  name: String
};

const slugCycle = createSlugCycler(Topics, true);

function updateTopic(topicId, data, auth) {
  const topic = Topics.findOne(topicId);

  auth(topic);

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
}

function deleteTopic(topicId, auth) {
  const topic = Topics.findOne(topicId);

  auth(topic);

  Topics.remove(topicId);

  Rooms.update(
    { _id: topic.room._id },
    { $inc: {
      topicCount: -1
    } }
  );

  Notifications.remove({ "topic._id": topicId });

  return topic;
}

function modUpdateDocBuilder(topicId, topic, slug, reason) {
  return docBuilder({
    item: {
      _id: topicId,
      ownerId: topic.owner._id,
      type: "topic",
      action: "updated",
      url: FlowRouter.path("topic", {
        roomSlug: _.get(topic, "room.slug"),
        topicSlug: slug
      })
    }
  }, reason);
}

function modDeleteDocBuilder(topicId, topic, reason) {
  return docBuilder({
    item: {
      _id: topicId,
      ownerId: topic.owner._id,
      type: "topic",
      action: "deleted"
    }
  }, reason);
}

Meteor.methods({
  addTopic(roomId, data, retId) {
    check(roomId, String);
    check(data, match);
    check(retId, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    const room = Rooms.findOne(roomId);

    if (room.membersOnlyCreate && ! isMember(Meteor.userId(), "community_" + room.slug)) {
      throw new Meteor.Error("not-authorized");
    }

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
  updateTopic(topicId, data) {
		check(topicId, String);
		check(data, match);
		return updateTopic(topicId, data, (topic) => {
      if (! isOwner(topic)) {
        throw new Meteor.Error("not-authorized");
      }
    });
	},
  modUpdateTopic(topicId, data, reason) {
		check(topicId, String);
		check(data, match);
    checkReason(reason);

    let topic;
    const slug = updateTopic(topicId, data, (t) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId())) {
        throw new Meteor.Error("not-authorized");
      }

      topic = t;
    });

    const doc = modUpdateDocBuilder(topicId, topic, slug, reason);
    ModLog.insert(doc);
	},
  communityModUpdateTopic(topicId, data, reason) {
		check(topicId, String);
		check(data, match);
    checkReason(reason);

    let topic;
    const slug = updateTopic(topicId, data, (t) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
      }

      if (! isMod(Meteor.userId(), "community_" + t.room.slug)) {
        throw new Meteor.Error("not-authorized");
      }

      topic = t;
    });

    const doc = modUpdateDocBuilder(topicId, topic, slug, reason);
    doc.community = _.pick(topic.room, [ "_id", "slug" ]);
    ModLog.insert(doc);
	},
  deleteTopic(topicId) {
    check(topicId, String);
    deleteTopic(topicId, (topic) => {
      if (! isOwner(topic)) {
        throw new Meteor.Error("not-authorized");
      }
    });
  },
  modDeleteTopic(topicId, reason) {
		check(topicId, String);
		checkReason(reason);

		const topic = deleteTopic(topicId, (topic) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId())) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = modDeleteDocBuilder(topicId, topic, reason);
		ModLog.insert(doc);
	},
  communityModDeleteTopic(topicId, reason) {
		check(topicId, String);
		checkReason(reason);

		const topic = deleteTopic(topicId, (topic) => {
			if (! Meteor.userId()) {
				throw new Meteor.Error("not-logged-in");
			}

			if (! isMod(Meteor.userId(), "community_" + topic.room.slug)) {
				throw new Meteor.Error("not-authorized");
			}
		});

		const doc = modDeleteDocBuilder(topicId, topic, reason);
    doc.community = _.pick(topic.room, [ "_id", "slug" ]);
		ModLog.insert(doc);
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
