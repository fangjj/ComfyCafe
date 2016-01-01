Meteor.publish("posts", function () {
	return Posts.find({ uploader: this.userId });
});

Meteor.publish("post", function (name) {
	check(name, String);
	return Posts.find({ name: name });
});

Meteor.publish("invites", function () {
	return Invites.find({ uploader: this.userId });
});
