function dmRoom() {
  return Rooms.findOne(
    {
      system: true,
      owner: { $exists: false }
    }
  );
}

function dmRoomBuilder() {
  if (! dmRoom()) {
    return Rooms.insert(
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        system: true,
        topicCount: 0,
        requireInvite: true,
        membersCanInvite: false,
        moderatorsCanInvite: false,
        adminsCanInvite: false,
        membersOnlyView: true,
        membersOnlyPost: true,
        membersOnlyCreate: true
      }
    );
  }
}

export { dmRoom, dmRoomBuilder };
