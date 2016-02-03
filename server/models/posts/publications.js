Meteor.publish("post", function (postId) {
	check(postId, String);
	//Meteor._sleepForMs(2000);
	return Posts.find({ _id: postId });
});

Meteor.publish("allPosts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find();
});

Meteor.publish("yourPosts", function () {
	//Meteor._sleepForMs(2000);
	return Posts.find({ "uploader._id": this.userId });
});

Meteor.publish("postFeed", function () {
	this.autorun(function (computation) {
		var user = Meteor.users.findOne(this.userId, { fields: { subscriptions: 1 } });
		return Posts.find(
			{ $or: [
				{ "uploader._id": this.userId },
				{ "uploader._id": { $in: user && user.subscriptions || [] } }
			] }
		);
	});
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
