// for Meteor.user()
Meteor.publish(null, function () {
  return Meteor.users.find(
		{ _id: this.userId },
    { fields: {
			settings: 1,
			avatars: 1,
			subscriptions: 1
		} }
	);
});

// for public consumption
Meteor.publish("user", function (username) {
	check(username, String);
	return Meteor.users.find(
		{ username: username },
		{ fields: {
			username: 1,
			profile: 1,
			avatars: 1
		} }
	);
});
