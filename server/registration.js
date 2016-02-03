Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;

    user.inviteKey = options.profile.key;
    delete user.profile.key;

    user.profile.sassyHash = CryptoJS.SHA256(user.emails[0].address).toString();
    // Generate default avatar.
    generateDjenticon(user._id, user.profile.sassyHash);
  }
  return user;
});

Accounts.validateNewUser(function (user) {
  if (! Meteor.users.findOne()) {
    // Always allow registration if this is the first user.
    return true;
  }
  if (Invites.findOne({ key: user.inviteKey })) {
    Invites.remove({ key: user.inviteKey });
    return true;
  }
  throw new Meteor.Error(403, "Registration key is invalid.");
});
