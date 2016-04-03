import _ from "lodash";

import Invites from "/imports/api/invites/collection";
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

    user.inviteKey = options.profile.key;
    delete user.profile.key;

    // Generate default avatar.
    generateDjenticon(user._id, CryptoJS.SHA256(user.emails[0].address).toString());

    // Create system room for user.
    var roomId = Rooms.insert(
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
				topicCount: 0
      }
    );
    user.room = {
      _id: roomId
    };
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

function checkInvite(user) {
  if (! Meteor.users.findOne()) {
    // Always allow registration if this is the first user.
    return true;
  }
  if (Invites.findOne({ key: user.inviteKey })) {
    Invites.remove({ key: user.inviteKey });
    return true;
  }
  throw new Meteor.Error("invalid-betakey", "Registration key is invalid.");
}

Accounts.validateNewUser(function (user) {
  const valid = _.reduce(
    [
      checkUsername,
      checkEmail,
      checkInvite
    ],
    (result, func) => {
      return result && func(user)
    },
    true
  );

  return valid;
});