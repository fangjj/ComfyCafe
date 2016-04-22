import Albums from "../collection";

Meteor.publish("album", function (username, albumName) {
	check(username, String);
	check(albumName, String);
	return Albums.find(
		{
			"owner.username": username,
			name: albumName
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
