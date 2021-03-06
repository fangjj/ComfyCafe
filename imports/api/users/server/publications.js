import _ from "lodash";

import { isMod } from "/imports/api/common/persimmons";

// for Meteor.user()
Meteor.publish(null, function () {
  return Meteor.users.find(
		{ _id: this.userId },
    { fields: {
      normalizedUsername: 1,
      roles: 1,
			settings: 1,
			avatars: 1,
			subscriptions: 1,
			subscribers: 1,
      room: 1,
      lastCelebrated: 1,
      bans: 1,
      communityBans: 1,
      blocking: 1
		} }
	);
});

// for public consumption
const publicFields = {
  username: 1,
  normalizedUsername: 1,
  profile: 1,
  avatars: 1,
  subscriptions: 1,
  subscribers: 1
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

const suggestionFields = {
  username: 1,
  normalizedUsername: 1,
  "profile.displayName": 1
};

Meteor.publish("userSuggestions", function (search) {
  check(search, Match.Optional(String));
  const doc = expr(() => {
    if (search) {
      const re = new RegExp("^" + _.escapeRegExp(search));
      return { $or: [
        { username: re },
        { normalizedUsername: re },
        { "profile.displayName": re }
      ] };
    } else {
      return null;
    }
  });
  if (! doc) {
    return this.ready();
  }
	return Meteor.users.find(
		doc,
		{ fields: suggestionFields }
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
