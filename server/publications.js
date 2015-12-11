Meteor.publish("posts", function () {
	return Posts.find();
});

Meteor.publish("media", function () {
	return Media.find();
});
