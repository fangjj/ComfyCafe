import Rooms from "/imports/api/rooms/collection";

Meteor.publish("room", function (slug) {
	check(slug, String);
	return Rooms.find({ slug });
});

Meteor.publish("allRooms", function () {
	return Rooms.find({ system: { $ne: true } });
});
