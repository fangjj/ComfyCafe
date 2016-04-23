import Albums from "/imports/api/albums/collection";
import Posts from "/imports/api/posts/collection";

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
	return Albums.find(
		{
			"owner.username": username
		}
	);
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
			{ fields: { posts: 1 } }
		);
		return Posts.find(
			{ _id: { $in: album.posts } },
			{ fields: { name: 1, owner: 1, medium: 1, visibility: 1, safety: 1, pretentiousFilter: 1 } }
		);
	});
});
