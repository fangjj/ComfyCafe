import ModLog from "/imports/api/modlog/collection";

Meteor.publish("modlog", function () {
	return ModLog.find({});
});
