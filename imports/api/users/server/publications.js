// for Meteor.user()
Meteor.publish(null, function () {
  return Meteor.users.find(
		{ _id: this.userId },
    { fields: {
      normalizedUsername: 1,
      "status.online": 1,
      "status.idle": 1,
			settings: 1,
			avatars: 1,
			subscriptions: 1,
			subscribers: 1,
      friends: 1,
      room: 1,
      defaultFilter: 1,
      lastCelebrated: 1
		} }
	);
});

// for public consumption
const publicFields = {
  username: 1,
  normalizedUsername: 1,
  "status.online": 1,
  "status.idle": 1,
  profile: 1,
  avatars: 1,
  subscriptions: 1,
  subscribers: 1,
  friends: 1
};

Meteor.publish("user", function (username) {
	check(username, String);
	return Meteor.users.find(
		{ normalizedUsername: username.toLowerCase() },
		{ fields: publicFields }
	);
});

Meteor.publish("userId", function (userId) {
	check(userId, String);
	return Meteor.users.find(
		{ _id: userId },
		{ fields: publicFields }
	);
});

Meteor.publish("users", function (ids) {
	check(ids, [String]);
	return Meteor.users.find(
		{ _id: { $in: ids } },
		{ fields: publicFields }
	);
});

Meteor.publish("allUsers", function () {
	return Meteor.users.find(
		{},
		{ fields: publicFields }
	);
});
