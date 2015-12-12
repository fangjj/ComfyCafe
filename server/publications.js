Meteor.publish("posts", function () {
	return Posts.find();
});

Meteor.publish("media", function () {
	return Media.find();
});

Meteor.publish("invites", function () {
	return Invites.find({ uploader: this.userId });
});
