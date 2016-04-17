function adminMethod(func) {
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }

  if (Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
    func();
  } else {
    throw new Meteor.Error("not-authorized");
  }
}

export default adminMethod;
