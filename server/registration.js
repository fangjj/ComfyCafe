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
