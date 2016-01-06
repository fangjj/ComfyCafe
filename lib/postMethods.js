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
				media.update({ _id: new Mongo.ObjectID(mediumId) }, { $set: { "metadata.post": post.name } });
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
	rerollPost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		nameCycle(function (name) {
			post.set("name", name);
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
		media.remove({ _id: new Mongo.ObjectID(post.medium) });
	}
});
