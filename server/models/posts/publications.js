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
			"owner.username": username,
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
	return Posts.find({ "owner.username": username });
});

Meteor.publish("postFeed", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: { subscriptions: 1 } });
			return Posts.find(
				{ $or: [
					{ "owner._id": this.userId },
					{ "owner._id": { $in: user && user.subscriptions || [] } }
				] }
			);
		} else {
			return Posts.find();
		}
	});
});

Meteor.publish("likes", function () {
	if (this.userId) {
		return Posts.find({ likes: this.userId });
	}
});

Meteor.publish("searchPosts", function (tagStr) {
	return queryTags(tagStr);
});
