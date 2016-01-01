Meteor.publish("posts", function () {
	Meteor._sleepForMs(2000);
	return Posts.find({ uploader: this.userId });
});

Meteor.publish("post", function (name) {
	check(name, String);
	Meteor._sleepForMs(2000);
	return Posts.find({ name: name });
});

Meteor.publish("invites", function () {
	Meteor._sleepForMs(2000);
	return Invites.find({ uploader: this.userId });
});
