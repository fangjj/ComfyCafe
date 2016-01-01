Meteor.users.deny({
  update: function() {
    return true;
  }
});

Security.defineMethod("ifCreated", {
  fetch: ["uploader"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.uploader;
  }
});

Posts.permit(["insert"]).ifLoggedIn().apply();
Posts.permit(["remove"]).ifLoggedIn().ifCreated().apply();

Invites.permit(["insert"]).ifLoggedIn().apply();
Invites.permit(["update", "remove"]).ifLoggedIn().ifCreated().apply();
