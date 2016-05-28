import ModLog from "/imports/api/modlog/collection";

Meteor.publish("modlog", function () {
	return ModLog.find({ community: { $exists: false } });
});

Meteor.publish("communityModlog", function (slug) {
	check(slug, String);
	return ModLog.find({ "community.slug": slug });
});
