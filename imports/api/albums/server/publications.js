import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";
import privacyWrap from "/imports/api/common/privacyWrap";

Meteor.publish("album", function (username, albumSlug) {
	check(username, String);
	check(albumSlug, String);
	return Albums.find(
		{
			"owner.username": username,
			slug: albumSlug
		}
	);
});

Meteor.publish("albumsBy", function (username) {
	check(username, String);
	this.autorun(function (computation) {
		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Albums.find(
				privacyWrap(
					{ "owner.username": username },
					this.userId,
					user.friends
				)
			);
		} else {
			return Albums.find(
				{
					"owner.username": username,
					visibility: "public"
				}
			);
		}
	});
});

Meteor.publish("albumPosts", function (username, albumSlug) {
	check(username, String);
	check(albumSlug, String);
	this.autorun(function (computation) {
		const album = Albums.findOne(
			{
				"owner.username": username,
				slug: albumSlug
			},
			{ fields: { "owner._id": 1, posts: 1 } }
		);

		if (this.userId) {
			const user = Meteor.users.findOne(this.userId, { fields: {
				friends: 1
			} });

			return Posts.find(
				privacyWrap(
					{ _id: { $in: album.posts } },
					this.userId,
					user.friends,
					{ "owner._id": album.owner._id }
				),
				{ fields: { name: 1, owner: 1, medium: 1, visibility: 1, safety: 1, pretentiousFilter: 1 } }
			);
		} else {
			return Posts.find(
				{ $and: [
					{ _id: { $in: album.posts } },
					{ $or: [
						{ visibility: "public" },
						{ "owner._id": album.owner._id }
					] }
				] },
				{ fields: { name: 1, owner: 1, medium: 1, visibility: 1, safety: 1, pretentiousFilter: 1 } }
			);
		}
	});
});
