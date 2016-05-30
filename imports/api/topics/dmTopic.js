import Topics from "/imports/api/topics/collection";
import { dmRoom, dmRoomBuilder } from "/imports/api/rooms/dmRoom";

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

  const doc = {
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivity: new Date(),
    room: { _id: roomId },
    messageCount: 0,
    relationship: [ Meteor.userId(), otherUser._id ]
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

export { dmTopic, dmTopicBuilder };
