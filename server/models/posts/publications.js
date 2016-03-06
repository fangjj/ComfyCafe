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
	return Posts.find({
		$or: [
			{ "owner._id": this.userId },
			{ visibility: "public" }
		]
	});
});

Meteor.publish("imagesBy", function (username) {
	//Meteor._sleepForMs(2000);
	check(username, String);
	return Posts.find(
		{
			"owner.username": username,
			$or: [
				{ "owner._id": this.userId },
				{ visibility: "public" }
			]
		}
	);
});

Meteor.publish("postFeed", function () {
	this.autorun(function (computation) {
		if (this.userId) {
			var self = this;

			var user = Meteor.users.findOne(this.userId, { fields: { subscriptions: 1 } });

			var doc = { $or: [
				{ "owner._id": this.userId },
				{
					"owner._id": { $in: user.subscriptions || [] },
					visibility: "public"
				}
			] };

			_.each(user.subscriptions || [], function (subId) {
				var owner = Meteor.users.findOne(subId, { fields: { friends: 1 } });

				if (owner.friends && _.contains(owner.friends, self.userId)) {
					doc.$or.push({
						"owner._id": subId,
						visibility: "friends"
					});
				}
			});

			prettyPrint(doc);

			return Posts.find(doc);
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
	var doc = privacyWrap(queryTags(tagStr), this.userId);
	return Posts.find(doc);
});
