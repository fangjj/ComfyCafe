Meteor.publish("user", function (username) {
	check(username, String);
	//Meteor._sleepForMs(2000);
	return Meteor.users.find(
		{ username: username },
		{
			username: true,
			profile: true,
			avatars: true
		}
	);
});
