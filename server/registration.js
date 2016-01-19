Accounts.onCreateUser(function (options, user) {
  if (options.profile) {
    user.profile = options.profile;
    user.profile.sassyHash = CryptoJS.SHA256(user.emails[0].address).toString();
  }
  return user;
});

Accounts.validateNewUser(function (user) {
  if (! Meteor.users.findOne()) {
    // Always allow registration if this is the first user.
    return true;
  }
  if (Invites.findOne({ key: user.profile.key })) {
    Invites.remove({ key: user.profile.key });
    return true;
  }
  throw new Meteor.Error(403, "Registration key is invalid.");
});
