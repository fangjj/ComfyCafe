Meteor.methods({
	addPost: function (data) {
		check(data, {
			mediumId: String,
			tags: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var medium = media.findOne({ _id: new Mongo.ObjectID(data.mediumId) });
		var tags = parseTagStr(data.tags, {reformat: true});

		var postId = Posts.insert(
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				uploader: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				},
				medium: {
					_id: medium._id,
					contentType: medium.contentType,
					md5: medium.md5
				},
				tags: tags,
				humanizedTags: humanizeTags(tags)
			}
		);

		if (Meteor.isServer) {
			media.update(
				{ _id: new Mongo.ObjectID(data.mediumId) },
				{ $set: {
					"metadata.post": postId,
					"metadata.bound": true
				} }
			);
		}

		return postId;
	},
	addTags: function (postId, tagStr) {
		check(postId, String);
		check(tagStr, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var tags = parseTagStr(tagStr, {reformat: true});
		var humanizedTags = humanizeTags(tags);

		Posts.update(
			{ _id: postId },
			{ $set: {
				tags: tags,
				humanizedTags: humanizedTags,
				updatedAt: new Date()
			} }
		);
	},
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
		media.remove({ "metadata.post": postId });
	}
});
