Meteor.publish("posts", function () {
	return Posts.find();
});

Meteor.publish("post", function (name) {
	check(name, String);
	return Posts.find({name: name});
});

Meteor.publish("media", function () {
	return Media.find();
});

Meteor.publish("medium", function (mediumId) {
	check(mediumId, String);
	return Media.find({ _id: mediumId });
});

Meteor.publish("invites", function () {
	return Invites.find({ uploader: this.userId });
});
