Meteor.publish("allTags", function (type) {
	check(type, Match.Optional(String));
	if (! type) {
		return Tags.find();
	} else {
		return Tags.find({ type: type });
	}
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
