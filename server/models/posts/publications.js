Meteor.publish("posts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find({ uploader: this.userId });
});

Meteor.publish("post", function (name) {
	check(name, String);
	//Meteor._sleepForMs(2000);
	return Posts.find({ name: name });
});

Meteor.publish("favorites", function () {
	//Meteor._sleepForMs(2000);
	if (this.userId) {
		return Posts.find({ favorited: this.userId });
	}
});
