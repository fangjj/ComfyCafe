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

			return Posts.find({
				$or: [
					{ "owner._id": this.userId },
					{ visibility: "public" },
					{
						"owner._id": { $in: user.friends },
						visibility: "friends"
					}
				]
			});
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

			return Posts.find({
				"owner.username": username,
				$or: [
					{ "owner._id": this.userId },
					{ visibility: "public" },
					{
						"owner._id": { $in: user.friends },
						visibility: "friends"
					}
				]
			});
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

			return Posts.find(
				{
					$or: [
						{ "owner._id": this.userId },
						{
							"owner._id": { $in: user.subscriptions || [] },
							visibility: "public"
						},
						{
							"owner._id": { $in: user.friends },
							visibility: "friends"
						}
					]
				}
			);
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

Meteor.publish("searchPosts", function (tagStr) {
	check(tagStr, String);
	var query = queryTags(tagStr);
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
