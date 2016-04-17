import Badges from "../collection";

Meteor.publish("badge", function (badgeId) {
	check(badgeId, String);
	return Badges.find({ _id: badgeId });
});

Meteor.publish("allBadges", function (type) {
	check(type, Match.Optional(String));
	if (! type) {
		return Badges.find();
	} else {
		return Badges.find({ type: type });
	}
});
