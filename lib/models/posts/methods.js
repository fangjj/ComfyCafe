var nameCycle = function (callback) {
	var name = generateName();
	if (Posts.findOne({ name: name })) {
		nameCycle(callback);
	} else {
		callback(name);
	}
};

Meteor.methods({
	addPost: function (data) {
		check(data, {
			mediumId: String,
			tags: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var postName;
		nameCycle(function (name) {
			postName = name;

			if (Meteor.isServer) {
				media.update(
					{ _id: new Mongo.ObjectID(data.mediumId) },
					{ $set: {
						"metadata.post": postName,
						"metadata.bound": true
					} }
				);
			}

			var medium = media.findOne({ _id: new Mongo.ObjectID(data.mediumId) });
			var tags = parseTagStr(data.tags, {reformat: true});

			Posts.insert(
				{
					name: postName,
					createdAt: new Date(),
					updatedAt: new Date(),
					uploader: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					},
					private: Meteor.user().profile.privateByDefault,
					medium: {
						_id: medium._id,
						contentType: medium.contentType,
						md5: medium.md5
					},
					tags: tags,
					humanizedTags: humanizeTags(tags)
				}
			);
		});

		return postName;
	},
	favoritePost: function (postId, state) {
		check(postId, String);
		check(state, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = Posts.findOne(postId);
		if (state) {
			Posts.update(
				{ _id: postId },
				{ $push: { favorited: Meteor.userId() } }
			);
		} else {
			Posts.update(
				{ _id: postId },
				{ $pull: { favorited: Meteor.userId() } }
			);
		}
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
	setPostVisibility: function (data) {
		check(data, {
      postId: String,
      private: Boolean
    });

		var post = Posts.findOne(data.postId);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.update(
			{ _id: data.postId },
			{ $set: {
				private: data.private,
				updatedAt: new Date()
			} }
		);
	},
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
		var oldName = post.name;

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var postName;
		nameCycle(function (name) {
			postName = name;

			Posts.update(
				{ _id: postId },
				{ $set: {
					name: postName,
					updatedAt: new Date()
				} }
			);

			if (Meteor.isServer) {
				media.update(
					{ "metadata.post": oldName },
					{ $set: { "metadata.post": postName } },
					{ multi: true }
				);
			}
		});

		return postName;
	},
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
		media.remove({ "metadata.post": post.name });
	}
});
