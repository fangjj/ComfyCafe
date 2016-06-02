function hasRoles(userId, something, group) {
  return Roles.userIsInRole(
    userId,
    something,
    group || Roles.GLOBAL_GROUP
  );
}

function isSomething(roles) {
  return function (userId, group) {
    if (typeof userId === "undefined") {
      userId = Meteor.userId();
    }
    return hasRoles(userId, roles, group);
  }
}

const isAdmin = isSomething(["admin"]);
const isDev = isSomething(["developer"]);
const isMod = isSomething(["moderator"]);
const isMember = isSomething(["member"]);

function isPriveleged(userId, group) {
  return isAdmin(userId, group) || isMod(userId, group);
}

export {
  hasRoles,
  isAdmin,
  isDev,
  isMod,
  isMember,
  isPriveleged
};
