Meteor.publish("commentsFor", function (postId) {
	check(postId, String);
	return Comments.find({ "post._id": postId });
});
