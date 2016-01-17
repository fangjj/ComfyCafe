Meteor.publish("avatars", function (clientUserId) {
	if (clientUserId === this.userId) {
		return avatars.find({ "metadata._Resumable": { $exists: false }, "metadata.owner": this.userId });
	} else {
		// Prevent client race condition:
		// This is triggered when publish is rerun with a new
		// userId before client has resubscribed with that userId
		return null;
	}
});

Meteor.publish("posts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find({ uploader: this.userId });
});

Meteor.publish("post", function (name) {
	check(name, String);
	//Meteor._sleepForMs(2000);
	return Posts.find({ name: name });
});

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

Meteor.publish("jobs", function (clientUserId) {
  if (this.userId === clientUserId) {
    return jobs.find({ "data.owner": this.userId });
  } else {

  }
});

Meteor.publish("favorites", function () {
	//Meteor._sleepForMs(2000);
	if (this.userId) {
		return Posts.find({ favorited: this.userId });
	}
});

Meteor.publish("favoriteMedia", function () {
	//Meteor._sleepForMs(2000);
	if (this.userId) {
		return media.find({ "metadata.favorited": this.userId });
	}
});

Meteor.publish("invites", function () {
	//Meteor._sleepForMs(2000);
	return Invites.find({ uploader: this.userId });
});
