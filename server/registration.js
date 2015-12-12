Accounts.validateNewUser(function (user) {
  if (Invites.findOne({ key: user.profile.key })) {
    return true;
  }
  throw new Meteor.Error(403, "Registration key is invalid.");
});

Accounts.onCreateUser(function(options, user) {
  Invites.remove({ key: user.profile.key });
  return user;
});
