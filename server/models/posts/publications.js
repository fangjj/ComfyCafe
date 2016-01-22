Meteor.publish("post", function (name) {
	check(name, String);
	//Meteor._sleepForMs(2000);
	return Posts.find({ name: name });
});

Meteor.publish("allPosts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find({ private: false });
});

Meteor.publish("yourPosts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find({ "uploader._id": this.userId });
});

Meteor.publish("postFeed", function (currentUser) {
	if (this.userId) {
		return Posts.find(
			{ $or: [
				{ "uploader._id": this.userId },
				{
					"uploader.profile.subscribers": this.userId,
					private: false
				}
			] }
		);
	}
});

Meteor.publish("favorites", function () {
	//Meteor._sleepForMs(2000);
	if (this.userId) {
		return Posts.find({ favorited: this.userId });
	}
});

Meteor.publish("searchPosts", function (tagStr) {
	console.log(tagStr);
	return queryTags(tagStr);
});
