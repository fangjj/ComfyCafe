import BlogPosts from "../collection";
import privacyWrap from "/imports/api/common/privacyWrap";

Meteor.publish("blogPost", function (postId) {
	check(postId, String);
	return BlogPosts.find({ _id: postId });
});

Meteor.publish("allBlogPosts", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });
			return BlogPosts.find(privacyWrap(
				{},
				this.userId,
				user.friends
			));
		} else {
			return BlogPosts.find(
				{
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("blogBy", function (username) {
	check(username, String);

	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });
			return BlogPosts.find(privacyWrap(
				{ "owner.username": username },
				this.userId,
				user.friends
			));
		} else {
			return BlogPosts.find(
				{
					"owner.username": username,
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("blogFeed", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				subscriptions: 1,
				friends: 1
			} });
			return BlogPosts.find(privacyWrap(
				{ $or: [
					{ "owner._id": this.userId },
					{ "owner._id": { $in: user && user.subscriptions || [] } }
				] },
				this.userId,
				user.friends
			));
		} else {
			return BlogPosts.find(
				{
					visibility: "public"
				}
			);
		}
	});
});
