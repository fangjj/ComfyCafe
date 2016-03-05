var nameCycle = function (options, callback) {
	var name = generateName(options);
	var taken = Boolean(Posts.findOne(
		{
			"owner._id": Meteor.userId(),
			name: name
		}
	));
	if (taken) {
		nameCycle(nsfw, callback);
	} else {
		callback(name);
	}
};

var injectAuthor = function (data, tags) {
	if (data.original) {
		var username = Meteor.user().username;
		if (! tags.authors) {
			tags.authors = [username];
		} else if (! _.has(tags.authors, username)) {
			tags.authors.push(username);
		}
	}
};

Meteor.methods({
	addPost: function (mediumId, data) {
		check(mediumId, String);
		check(data, {
			visibility: String,
			original: Boolean,
			description: String,
			tags: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		var tags = parseTagStr(data.tags, {reformat: true});
		injectAuthor(data, tags);

		var name;
		nameCycle({}, function (n) {
			name = n;

			var postId = Posts.insert(
				{
					createdAt: new Date(),
					updatedAt: new Date(),
					name: name,
					owner: {
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
					original: data.original,
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

	      processMentions("post", data.description, {
	        post: {
	          _id: postId,
	          name: name
	        }
	      });
	    }
		});

		return name;
	},
	updatePost: function (postId, data) {
		check(postId, String);
		check(data, {
			visibility: String,
			original: Boolean,
			description: String,
			tags: String
		});

		var post = Posts.findOne(postId);

		if (! post.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var tags = parseTagStr(data.tags, {reformat: true});
		injectAuthor(data, tags);

		Posts.update(
			{ _id: postId },
			{ $set: {
				updatedAt: new Date(),
				visibility: data.visibility,
				original: data.original,
				description: data.description,
				tags: tags,
				humanizedTags: humanizeTags(tags)
			} }
		);

		if (Meteor.isServer) {
			processMentions("post", data.description, {
				post: {
					_id: postId,
					name: post.name
				}
			});
		}
	},
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
		var oldName = post.name;

		if (! post.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			var name;
			nameCycle({}, function (n) {
				name = n;
				Posts.update(
					{ _id: postId },
					{ $set: {
						name: name
					} }
				);

				Notifications.update(
					{ "post._id": postId },
					{ $set: {
						"post.name": name
					} },
					{ multi: true }
				);
			});

			return name;
		}
	},
	likePost: function (postId, state) {
		check(postId, String);
		check(state, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var key;
		if (state) {
			key = "$addToSet";
		} else {
			key = "$pull";
		}

		var doc = {};
		doc[key] = { likes: Meteor.userId() };

		Posts.update(
			{ _id: postId },
			doc
		);

		if (state) {
			var post = Posts.findOne({ _id: postId });
			Notifications.insert(
				{
					createdAt: new Date(),
					to: post.owner._id,
					action: "postLiked",
					owner: {
						_id: Meteor.userId(),
						username: Meteor.user().username,
						profile: Meteor.user().profile
					},
					post: {
						_id: postId,
						name: post.name
					}
				}
			);
		} else {
			Notifications.remove(
				{
					action: "postLiked",
					"owner._id": Meteor.userId(),
					"post._id": postId
				}
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
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! post.owner._id === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
		media.remove({ "metadata.post": postId });
	}
});
