import Tags from "/imports/api/tags/collection";
import TagHistory from "/imports/api/tags/history/collection";

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

Meteor.publish("tagHistory", function (tagId) {
	check(tagId, String);
	return TagHistory.find({ tagId });
});
