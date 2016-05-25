import { isMod } from "/imports/api/common/persimmons";

// for Meteor.user()
Meteor.publish(null, function () {
  return Meteor.users.find(
		{ _id: this.userId },
    { fields: {
      normalizedUsername: 1,
      roles: 1,
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

// for mods
const modFields = {
  username: 1,
  normalizedUsername: 1,
  roles: 1,
  profile: 1,
  avatars: 1
};

Meteor.publish("modUser", function (userId) {
  if (isMod(this.userId)) {
    return Meteor.users.find(
      { _id: userId },
      { fields: modFields }
    );
  }
});

Meteor.publish("modAllUsers", function () {
  if (isMod(this.userId)) {
    return Meteor.users.find(
      {},
      { fields: modFields }
    );
  }
});

// for community mods
const communityModFields = {
  username: 1,
  normalizedUsername: 1,
  roles: 1
};

Meteor.publish("communityModMember", function (slug, userId) {
  check(slug, String);
  if (isMod(this.userId, "community_" + slug)) {
    return Meteor.users.find(
      { _id: userId },
      { fields: communityModFields }
    );
  }
});

Meteor.publish("communityModAllMembers", function (slug) {
  check(slug, String);
  const group = "community_" + slug;
  if (isMod(this.userId, group)) {
    const doc = {};
    doc["roles." + group] = "member";
    return Meteor.users.find(
      doc,
      { fields: communityModFields }
    );
  }
});
