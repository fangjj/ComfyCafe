import Posts from "../collection";
import { postsPerPage } from "../constants";
import privacyWrap from "/imports/api/common/privacyWrap";
import tagQuery from "/imports/api/tags/query";

function options(page) {
	return {
		sort: { createdAt: -1, name: 1 },
		limit: (page + 1) * postsPerPage
	};
}

Meteor.publish("postPerma", function (postId) {
	check(postId, String);
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

Meteor.publish("allPosts", function (page=0) {
	check(page, Number);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Posts.find(
				privacyWrap(
					{},
					this.userId,
					user.friends
				),
				options(page)
			);
		} else {
			return Posts.find(
				{
					visibility: "public"
				},
				options(page)
			);
		}
	});
});

Meteor.publish("imagesBy", function (username, page=0) {
	check(username, String);
	check(page, Number);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Posts.find(
				privacyWrap(
					{ "owner.username": username },
					this.userId,
					user.friends
				),
				options(page)
			);
		} else {
			return Posts.find(
				{
					"owner.username": username,
					visibility: "public"
				},
				options(page)
			);
		}
	});
});

Meteor.publish("postFeed", function (page=0) {
	//Meteor._sleepForMs(250);
	check(page, Number);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				subscriptions: 1,
				friends: 1
			} });

			return Posts.find(
				privacyWrap(
					{ $or: [
						{ "owner._id": this.userId },
						{ "owner._id": { $in: user.subscriptions || [] } }
					] },
					this.userId,
					user.friends
				),
				options(page)
			);
		} else {
			return Posts.find({ visibility: "public" });
		}
	});
});

Meteor.publish("likes", function (page=0) {
	check(page, Number);
	if (this.userId) {
		return Posts.find(
			{ likes: this.userId },
			options(page)
		);
	}
});

Meteor.publish("bookmarks", function (page=0) {
	check(page, Number);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				bookmarks: 1
			} });

			return Posts.find(
				{ _id: { $in: user.bookmarks || [] } },
				options(page)
			);
		}
	});
});

Meteor.publish("searchPosts", function (tagStr, page=0) {
	check(tagStr, String);
	check(page, Number);
	const query = tagQuery(tagStr);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			const doc = privacyWrap(query, this.userId, user.friends);
			return Posts.find(
				doc,
				options(page)
			);
		} else {
			const doc = privacyWrap(query);
			return Posts.find(
				doc,
				options(page)
			);
		}
	});
});
