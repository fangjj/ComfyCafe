Meteor.methods({
	addPost: function (mediumId) {
		check(mediumId, String);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var post = new Post();

		Meteor.call("generateName", function (err, name) {
			post.name = name;
			post.uploader = Meteor.userId();
			post.medium = mediumId;

			if (post.validate()) {
				post.save();
			}
		});

		return post.name;
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
