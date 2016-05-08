// for Meteor.user()
Meteor.publish(null, function () {
  return Meteor.users.find(
		{ _id: this.userId },
    { fields: {
			settings: 1,
			avatars: 1,
			subscriptions: 1,
      friends: 1,
      room: 1,
      bookmarks: 1
		} }
	);
});

// for public consumption
const publicFields = {
  username: 1,
  profile: 1,
  avatars: 1,
  friends: 1
};

Meteor.publish("user", function (username) {
	check(username, String);
	return Meteor.users.find(
		{ username: username },
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
