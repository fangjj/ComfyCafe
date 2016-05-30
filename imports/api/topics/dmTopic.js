import _ from "lodash";

import Topics from "/imports/api/topics/collection";
import { dmRoom, dmRoomBuilder } from "/imports/api/rooms/dmRoom";
import injectOwner from "/imports/api/users/injectOwner";

function dmTopicBuilder(username) {
  check(username, String);
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }
  const otherUser = Meteor.users.findOne({ normalizedUsername: username.toLowerCase() });
  if (! otherUser) {
    throw new Meteor.Error("return-to-sender-address-unknown-no-such-number-no-such-zone");
  }

  const roomId = expr(() => {
    const room = dmRoom();
    if (! room) {
      return dmRoomBuilder();
    } return room._id;
  });

  const owner0 = injectOwner({}).owner;
  const owner1 = injectOwner({}, otherUser).owner;

  const doc = {
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivity: new Date(),
    room: { _id: roomId },
    messageCount: 0,
    relationship: [ Meteor.userId(), otherUser._id ],
    owner0,
    owner1
  };
  return Topics.insert(doc);
}

function dmTopic(username) {
  check(username, String);
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }
  const otherUser = Meteor.users.findOne({ normalizedUsername: username.toLowerCase() });
  if (! otherUser) {
    throw new Meteor.Error("return-to-sender-address-unknown-no-such-number-no-such-zone");
  }
  return Topics.findOne({ relationship: { $all: [ Meteor.userId(), otherUser._id ] } });
}

function dmTopicSync(query, update) {
  Topics.update(
    _.mapKeys(query, (subDoc, key) => {
      return key.replace("owner", "owner0");
    }),
    _.mapValues(update, (subDoc) => {
      return _.mapKeys(subDoc, (subSub, key) => {
        return key.replace("owner", "owner0");
      });
    }),
    { multi: true }
  );

  Topics.update(
    _.mapKeys(query, (subDoc, key) => {
      return key.replace("owner", "owner1");
    }),
    _.mapValues(update, (subDoc) => {
      return _.mapKeys(subDoc, (subSub, key) => {
        return key.replace("owner", "owner1");
      });
    }),
    { multi: true }
  );
}

export { dmTopic, dmTopicBuilder, dmTopicSync };
