Meteor.publish("allTags", function () {
	return Tags.find();
});

Meteor.publish("tag", function (tagName) {
	check(tagName, String);
	return Tags.find(
		{ $or: [
			{ name: tagName },
			{ aliases: tagName }
		] }
	);
});

Meteor.publish("tags", function (nameList) {
	check(nameList, [String]);
	return Tags.find(
		{ $or: [
			{ name: { $in: nameList || [] } },
			{ aliases: { $in: nameList || [] } }
		] }
	);
});
