var nameCycle = function (callback) {
	var name = generateName();
	var taken = Boolean(Posts.findOne(
		{
			"uploader._id": Meteor.userId(),
			name: name
		}
	));
	if (taken) {
		nameCycle(callback);
	} else {
		callback(name);
	}
};

Meteor.methods({
	addPost: function (mediumId, data) {
		check(mediumId, String);
		check(data, {
			visibility: String,
			description: String,
			tags: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });
		var tags = parseTagStr(data.tags, {reformat: true});

		var name;
		nameCycle(function (n) {
			name = n;

			var postId = Posts.insert(
				{
					createdAt: new Date(),
					updatedAt: new Date(),
					name: name,
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
					visibility: data.visibility,
					description: data.description,
					tags: tags,
					humanizedTags: humanizeTags(tags)
				}
			);

			if (Meteor.isServer) {
				media.update(
					{ _id: new Mongo.ObjectID(mediumId) },
					{ $set: {
						"metadata.post": postId,
						"metadata.bound": true
					} }
				);
			}
		});

		return name;
	},
	updatePost: function (postId, data) {
		check(postId, String);
		check(data, {
			visibility: String,
			description: String,
			tags: String
		});

		var post = Posts.findOne(postId);

		if (! post.uploader._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var tags = parseTagStr(data.tags, {reformat: true});

		Posts.update(
			{ _id: postId },
			{ $set: {
				updatedAt: new Date(),
				visibility: data.visibility,
				description: data.description,
				tags: tags,
				humanizedTags: humanizeTags(tags)
			} }
		);
	},
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
		var oldName = post.name;

		if (! post.uploader._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var name;
		nameCycle(function (n) {
			name = n;
			Posts.update(
				{ _id: postId },
				{ $set: {
					name: name
				} }
			);
		});

		return name;
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
