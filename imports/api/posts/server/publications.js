import Posts from "../collection";
import privacyWrap from "/imports/api/common/privacyWrap";

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

Meteor.publish("allPosts", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Posts.find(privacyWrap(
				{},
				this.userId,
				user.friends
			));
		} else {
			return Posts.find(
				{
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("imagesBy", function (username) {
	check(username, String);
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Posts.find(privacyWrap(
				{ "owner.username": username },
				this.userId,
				user.friends
			));
		} else {
			return Posts.find(
				{
					"owner.username": username,
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("postFeed", function () {
	//Meteor._sleepForMs(2000);
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				subscriptions: 1,
				friends: 1
			} });

			return Posts.find(privacyWrap(
				{ $or: [
					{ "owner._id": this.userId },
					{ "owner._id": { $in: user.subscriptions || [] } }
				] },
				this.userId,
				user.friends
			));
		} else {
			return Posts.find({ visibility: "public" });
		}
	});
});

Meteor.publish("likes", function () {
	if (this.userId) {
		return Posts.find({ likes: this.userId });
	}
});

Meteor.publish("bookmarks", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				bookmarks: 1
			} });

			return Posts.find({ _id: { $in: user.bookmarks || [] } });
		}
	});
});

Meteor.publish("searchPosts", function (tagStr) {
	check(tagStr, String);
	var query = tagQuery(tagStr);
	this.autorun(function (computation) {
		if (this.userId) {
			var user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			var doc = privacyWrap(query, this.userId, user.friends);
			return Posts.find(doc);
		} else {
			var doc = privacyWrap(query);
			return Posts.find(doc);
		}
	});
});
