function adminPublication(callback) {
  return function (clientUserId) {
    check(clientUserId, Match.Optional(String));
    if (clientUserId === this.userId) {
      this.autorun(function (computation) {
        const isAdmin = Roles.userIsInRole(this.userId, ["admin"], Roles.GLOBAL_GROUP);
        if (isAdmin) {
          return callback.apply(this, arguments);
        } else {
          console.log("You're just a poser!");
        }
      });
    }
  }
}

export default adminPublication;
