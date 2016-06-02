import BlogPosts from "/imports/api/blog/collection";
import privacyWrap from "/imports/api/common/privacyWrap";
import { isMod } from "/imports/api/common/persimmons";

Meteor.publish("blogPost", function (username, slug) {
	check(username, String);
	check(slug, String);
	return BlogPosts.find(
		{
			slug: slug,
			"owner.username": username
		}
	);
});

Meteor.publish("allBlogPosts", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
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
			const user = Meteor.users.findOne(this.userId, { fields: {
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
			const user = Meteor.users.findOne(this.userId, { fields: {
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

Meteor.publish("modAllBlogPosts", function () {
	if (isMod(this.userId)) {
  	return BlogPosts.find({});
	}
});

Meteor.publish("modBlogPost", function (blogId) {
  check(blogId, String);
	if (isMod(this.userId)) {
		return BlogPosts.find({ _id: blogId });
	}
});
