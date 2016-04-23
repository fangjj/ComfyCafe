import media from "../collection";

Meteor.publish("medium", function (mediumId) {
	check(mediumId, String);
	return media.find({ _id: new Mongo.ObjectID(mediumId) });
});

Meteor.publish("mediaQueue", function (clientUserId) {
	check(clientUserId, Match.Optional(String));
	if (clientUserId === this.userId) {
		return media.find(
			{
				"metadata.owner": clientUserId,
				"metadata.complete": true,
				"metadata.bound": { $ne: true }
			},
			{ fields: {
				filename: 1,
				contentType: 1,
				md5: 1,
				"metadata.owner": 1,
				"metadata.complete": 1,
				"metadata.bound": 1
			} }
		);
	} else {
		return null;
	}
});
