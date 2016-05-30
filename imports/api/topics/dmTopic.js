import { dmRoom, dmRoomBuilder } from "/imports/api/rooms/dmRoom";

function dmTopicBuilder(otherUserId) {
  check(otherUserId, String);
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }
  const otherUser = Meteor.users.findOne({ _id: otherUserId });
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
    relationship: [ Meteor.userId(), otherUserId ]
  };
  const topicId = Topics.insert(doc);
}

function dmTopic(otherUserId) {
  check(otherUserId, String);
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }
  return Topics.findOne({ relationship: { $all: [ Meteor.userId(), otherUserId ] } });
}

export { dmTopic, dmTopicBuilder };
