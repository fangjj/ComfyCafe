Meteor.methods({
	addPost: function (data) {
		check(data, {
      medium: String
    });

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = new Post();

		data.uploader = Meteor.user();

		post.set(data);
		if (post.validate()) {
			post.save();
		}
	},
	deletePost: function (postId) {
		check(postId, String);

		var post = Posts.findOne(postId);
    var medium = Media.findOne(post.medium);

		if (! post.uploader === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
		Media.remove(post.medium);
	}
});
