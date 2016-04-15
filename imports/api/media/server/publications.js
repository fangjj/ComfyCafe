import media from "../collection";

Meteor.publish("media", function (clientUserId) {
	console.error("Why would you subscribe to all the media?!");
	if (clientUserId === this.userId) {
		return media.find({
			"metadata._Resumable": { $exists: false },
			"metadata.owner": this.userId
		});
	} else {
		// Prevent client race condition:
		// This is triggered when publish is rerun with a new
		// userId before client has resubscribed with that userId
		return null;
	}
});

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
				"metadata.bound": { $ne: true }
			},
			{ fields: {
				filename: 1,
				contentType: 1,
				md5: 1
			} }
		);
	} else {
		return null;
	}
});
