import Topics from "/imports/api/topics/collection";
import prefixer from "/imports/api/common/prefixer";

function baseTopicPub(doc) {
	this.autorun(function (computation) {
		const topics = Topics.find(doc);
		const exists = Boolean(topics.fetch().length);
		if (exists) {
			const users = Meteor.users.find(
				{ _id: { $in: topics.fetch()[0].users || [] } },
				{ fields: { "status.online": 1, "status.idle": 1 } }
			);
			return [ topics, users ];
		} else {
			return null;
		}
	});
}

Meteor.publish("topic", function (slug) {
	check(slug, String);
	return baseTopicPub.call(this, { slug });
});

Meteor.publish("topicId", function (id) {
	check(id, String);
	return baseTopicPub.call(this, { _id: id });
});

Meteor.publish("roomTopics", function (slug) {
	check(slug, String);
	return Topics.find(prefixer("room", { slug }));
});
