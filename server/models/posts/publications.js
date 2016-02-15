Meteor.publish("postPerma", function (postId) {
	check(postId, String);
	//Meteor._sleepForMs(2000);
	return Posts.find({ _id: postId });
});

Meteor.publish("post", function (username, postName) {
	check(username, String);
	check(postName, String);
	//Meteor._sleepForMs(2000);
	return Posts.find(
		{
			"uploader.username": username,
			name: postName
		}
	);
});

Meteor.publish("allPosts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find();
});

Meteor.publish("artBy", function (username) {
	//Meteor._sleepForMs(2000);
	check(username, String);
	return Posts.find({ "uploader.username": username });
});

Meteor.publish("postFeed", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: { subscriptions: 1 } });
			return Posts.find(
				{ $or: [
					{ "uploader._id": this.userId },
					{ "uploader._id": { $in: user && user.subscriptions || [] } }
				] }
			);
		} else {
			return Posts.find();
		}
	});
});

Meteor.publish("favorites", function () {
	if (this.userId) {
		return Posts.find({ favorited: this.userId });
	}
});

Meteor.publish("searchPosts", function (tagStr) {
	return queryTags(tagStr);
});
