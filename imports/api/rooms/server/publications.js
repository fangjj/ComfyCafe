import Rooms from "/imports/api/rooms/collection";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("room", function (slug) {
	check(slug, String);
	return Rooms.find({ slug });
});

Meteor.publish("allRooms", function () {
	return Rooms.find({ system: { $ne: true } });
});

Meteor.publish("modAllCommunities", function () {
	if (isMod(this.userId)) {
  	return Rooms.find({});
	}
});

Meteor.publish("modCommunity", function (communityId) {
  check(communityId, String);
	if (isMod(this.userId)) {
		return Rooms.find({ _id: communityId });
	}
});
