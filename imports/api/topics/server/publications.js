import Topics from "/imports/api/topics/collection";
import privacyWrap from "/imports/api/common/privacyWrap";
import prefixer from "/imports/api/common/prefixer";

Meteor.publish("topic", function (slug) {
	check(slug, String);
	return Topics.find({ slug });
});

Meteor.publish("topicId", function (id) {
	check(id, String);
	return Topics.find({ _id: id });
});

Meteor.publish("roomTopics", function (slug) {
	check(slug, String);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Topics.find(privacyWrap(
				prefixer("room", { slug }),
				this.userId,
				user.friends
			));
		} else {
			return Topics.find(
				{
					"room.slug": slug,
					visibility: "public"
				}
			);
		}
	});
});
