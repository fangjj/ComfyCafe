var nameCycle = function (callback) {
	var name = generateName();
	if (Posts.findOne({ name: name })) {
		nameCycle(callback);
	} else {
		callback(name);
	}
};

Meteor.methods({
	addPost: function (mediumId) {
		check(mediumId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = new Post();

		nameCycle(function (name) {
			post.name = name;
			if (Meteor.isServer) {
				media.update(
					{ _id: new Mongo.ObjectID(mediumId) },
					{ $set: { "metadata.post": post.name } }
				);
			}
		});
		post.uploader = Meteor.userId();
		post.medium = mediumId;

		if (post.validate()) {
			post.save();
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
			if (Meteor.isServer) {
				media.update(
					{ "metadata.post": post.name },
					{ $push: { "metadata.favorited": Meteor.userId() } },
					{ multi: true }
				);
			}
		} else {
			post.pull("favorited", Meteor.userId());
			if (Meteor.isServer) {
				media.update(
					{ "metadata.post": post.name },
					{ $pull: { "metadata.favorited": Meteor.userId() } },
					{ multi: true }
				);
			}
		}
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
					{ $set: { "metadata.post": post.name } },
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

		Posts.remove(postId);
		// We only need to delete the master medium, since job-collection handles the rest.
		media.remove({ _id: new Mongo.ObjectID(post.medium) });
	}
});
