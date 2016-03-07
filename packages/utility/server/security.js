Security.defineMethod("ifOwner", {
  fetch: ["owner"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.owner._id;
  }
});
