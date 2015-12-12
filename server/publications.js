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

Meteor.publish("medium", function (name) {
	check(name, String);
	var post = Posts.findOne({name: name});
	return Media.find({ _id: post.medium });
});

Meteor.publish("invites", function () {
	return Invites.find({ uploader: this.userId });
});
