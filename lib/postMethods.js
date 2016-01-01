var nameCycle = function (callback) {
	var name = generateName();
	if (Posts.findOne({ name: name })) {
		nameCycle(callback);
	} else {
		callback(name);
	}
};

Meteor.methods({
	addPost: function (medium) {
		check(medium, {
			_id: String,
			file: {
				name: String,
				type: String,
				size: Number,
				original_name: String
			},
			loaded: Number,
			percent_uploaded: Number,
			relative_url: String,
			secure_url: String,
			status: String,
			total: Number,
			uploader: String,
			url: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = new Post();

		nameCycle(function (name) {
			post.name = name;
		});
		post.uploader = Meteor.userId();
		post.medium._id = medium._id;
		post.medium.url = medium.url;
		post.medium.type = medium.file.type;
		post.medium.size = medium.file.size;
		post.medium.name = medium.file.name;
		post.medium.originalName = medium.file.original_name;
		post.medium.relativePath = medium.relative_url;

		if (post.validate()) {
			post.save();
		}
		return post.name;
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

		if (Meteor.isServer) {
			S3.deleteObject(post.medium.relativePath);
		}
	}
});
