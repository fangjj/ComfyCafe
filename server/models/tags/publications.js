Meteor.publish("tag", function (tagName) {
	check(tagName, String);
	return Tags.find({ name: tagName });
});

Meteor.publish("allTags", function () {
	return Tags.find();
});
