import _ from "lodash";

import Rooms from "/imports/api/rooms/collection";
import generateDjenticon from "/imports/api/users/server/djenticon";
import {
  validateUsername,
  validateEmail
} from "/imports/api/users/validators";

Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;
    user.settings = {};

    user.normalizedUsername = user.username.toLowerCase();

    // Generate default avatar.
    generateDjenticon(user._id, CryptoJS.SHA256(user.emails[0].address).toString());

    user.subscriptions = [];
    user.subscribers = [];

    // Create system room for user.
    const roomId = Rooms.insert(
      {
        createdAt: new Date(),
				updatedAt: new Date(),
				lastActivity: new Date(),
        name: user.username,
        slug: user._id,
				owner: {
					_id: user._id,
					username: user.username,
					profile: user.profile
				},
        system: true,
				topicCount: 0,
        requireInvite: true,
        membersOnlyCreate: true
      }
    );
    user.room = {
      _id: roomId
    };

    user.roles = {};
    if (! Meteor.users.findOne()) {
      // If this is the first user, give them ULTIMATE POWER.
      user.roles["__global_roles__"] = [ "admin", "moderator" ];
    }
    user.roles["community_" + user._id] = [ "admin", "moderator", "member" ];
  }
  return user;
});

function checkUsername(user) {
  if (validateUsername(user.username)) {
    return true;
  }
  throw new Meteor.Error("invalid-username", "Username is invalid.");
}

function checkEmail(user) {
  if (validateEmail(user.emails[0].address)) {
    return true;
  }
  throw new Meteor.Error("invalid-email", "Email is invalid.");
}

Accounts.validateNewUser(function (user) {
  const valid = _.reduce(
    [
      checkUsername,
      checkEmail
    ],
    (result, func) => {
      return result && func(user)
    },
    true
  );

  return valid;
});
