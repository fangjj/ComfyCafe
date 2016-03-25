Meteor.methods({
	addBlogPost: function (data) {
		check(data, {
			visibility: String,
			body: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

		var postId = BlogPosts.insert(
			{
				createdAt: new Date(),
				updatedAt: new Date(),
				owner: {
					_id: Meteor.userId(),
					username: Meteor.user().username,
					profile: Meteor.user().profile
				},
				visibility: data.visibility,
				body: data.body
			}
		);

		if (Meteor.isServer) {
			processMentions("blog", data.body, {
				blog: {
					_id: postId
				}
			});
		}
	},
	updateBlogPost: function (postId, data) {
		check(postId, String);
		check(data, {
			visibility: String,
			body: String
		});

		var post = BlogPosts.findOne(postId);

		if (post.owner._id !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		BlogPosts.update(
			{ _id: postId },
			{ $set: {
				updatedAt: new Date(),
				visibility: data.visibility,
				body: data.body
			} }
		);

		if (Meteor.isServer) {
			processMentions("blog", data.body, {
				blog: {
					_id: postId
				}
			});
		}
	},
	deleteBlogPost: function (postId) {
		check(postId, String);

		var post = BlogPosts.findOne(postId);

		if (post.owner._id !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		BlogPosts.remove(postId);
	}
});
