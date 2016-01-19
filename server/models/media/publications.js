Meteor.publish("media", function (clientUserId) {
	if (clientUserId === this.userId) {
		return media.find({ "metadata._Resumable": { $exists: false }, "metadata.owner": this.userId });
	} else {
		// Prevent client race condition:
		// This is triggered when publish is rerun with a new
		// userId before client has resubscribed with that userId
		return null;
	}
});

Meteor.publish("postMedia", function (name) {
	check(name, String);
	return media.find({ "metadata.post": name });
});

Meteor.publish("favoriteMedia", function () {
	//Meteor._sleepForMs(2000);
	if (this.userId) {
		return media.find({ "metadata.favorited": this.userId });
	}
});
