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

		var post = new Post();

		nameCycle(function (name) {
			post.name = name;
			if (Meteor.isServer) {
				media.update(
					{ _id: new Mongo.ObjectID(data.mediumId) },
					{ $set: {
						"metadata.post": post.name,
						"metadata.bound": true
					} }
				);
			}
		});
		post.uploader = {
			_id: Meteor.userId(),
			username: Meteor.user().username,
			profile: Meteor.user().profile
		};

		post.private = Meteor.user().profile.privateByDefault;

		var medium = media.findOne({ _id: new Mongo.ObjectID(data.mediumId) });
		post.medium = {
			_id: medium._id,
			contentType: medium.contentType,
			md5: medium.md5
		};

		post.tags = parseTagStr(data.tags, {reformat: true});
		post.humanizedTags = humanizeTags(post.tags);

		if (post.validate()) {
			post.save();

			Meteor.users.update(
				{ _id: Meteor.userId() },
				{ $push: { "posts": post._id } }
			);
		}
		return post.name;
	},
	favoritePost: function (postId, state) {
		check(postId, String);
		check(state, Boolean);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = Posts.findOne(postId);
		if (state) {
			post.push("favorited", Meteor.userId());
		} else {
			post.pull("favorited", Meteor.userId());
		}
		if (post.validate()) {
			post.save();
		}
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

		post.set("private", data.private);

		if (post.validate()) {
			post.save();
		}
	},
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
		var oldName = post.name;

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		nameCycle(function (name) {
			post.set("name", name);
			if (Meteor.isServer) {
				media.update(
					{ "metadata.post": oldName },
					{ $set: { "metadata.post": name } },
					{ multi: true }
				);
			}
		});

		if (post.validate()) {
			post.save();
		}
		return post.name;
	},
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: { "posts": post._id } }
		);

		Posts.remove(postId);
		media.remove({ "metadata.post": post.name });
	}
});
