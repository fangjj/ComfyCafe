Meteor.publish("room", function (roomId) {
	check(roomId, String);
	return Rooms.find({ _id: roomId });
});

Meteor.publish("allRooms", function () {
	return Rooms.find({ system: { $ne: true } });
});
