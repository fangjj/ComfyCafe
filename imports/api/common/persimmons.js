function hasRoles(userId, something) {
  return Roles.userIsInRole(
    userId,
    something,
    Roles.GLOBAL_GROUP
  );
}

function isSomething(roles) {
  return function (userId) {
    return hasRoles(userId || Meteor.userId(), roles);
  }
}

const isAdmin = isSomething(["admin"]);
const isMod = isSomething(["moderator"]);

function isPriveleged(userId) {
  return isAdmin(userId) || isMod(userId);
}

export {
  hasRoles,
  isAdmin,
  isMod,
  isPriveleged
};
