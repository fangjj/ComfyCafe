Meteor.publish("blogPostPerma", function (postId) {
	check(postId, String);
	return BlogPosts.find({ _id: postId });
});

Meteor.publish("blogPost", function (username, postName) {
	check(username, String);
	check(postName, String);
	return BlogPosts.find(
		{
			"owner.username": username,
			name: postName
		}
	);
});

Meteor.publish("allBlogPosts", function () {
	return BlogPosts.find();
});

Meteor.publish("blogBy", function (username) {
	check(username, String);
	return BlogPosts.find({ "owner.username": username });
});

Meteor.publish("blogFeed", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: { subscriptions: 1 } });
			return BlogPosts.find(
				{ $or: [
					{ "owner._id": this.userId },
					{ "owner._id": { $in: user && user.subscriptions || [] } }
				] }
			);
		} else {
			return BlogPosts.find();
		}
	});
});