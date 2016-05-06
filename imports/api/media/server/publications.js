import media from "../collection";

Meteor.publish("medium", function (mediumId) {
	check(mediumId, String);
	return media.find({ _id: new Mongo.ObjectID(mediumId) });
});

Meteor.publish("mediaQueue", function (clientUserId) {
	if (clientUserId === this.userId) {
		return media.find(
			{
				"metadata.owner": clientUserId,
				"metadata.complete": true,
				"metadata.bound": { $ne: true },
				"metadata.thumbnailPolicy": { $exists: true }
			},
			{ fields: {
				filename: 1,
				contentType: 1,
				md5: 1,
				"metadata.owner": 1,
				"metadata.complete": 1,
				"metadata.bound": 1,
				"metadata.thumbnailPolicy": 1
			} }
		);
	} else {
		return null;
	}
});
