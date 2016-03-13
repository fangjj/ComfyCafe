Meteor.publish("tag", function (tagName) {
	check(tagName, String);
	return Tags.find({ name: tagName });
});

Meteor.publish("allTags", function () {
	return Tags.find();
});

Meteor.publish("tags", function (nameList) {
	check(nameList, [String]);
	return Tags.find({ name: { $in: nameList || [] } });
});

Meteor.publish("canonicalTag", function (tag) {
	check(tag, String);
	return Tags.find(
		{ $or: [
      { name: tag },
      { aliases: tag }
    ] }
	);
});
