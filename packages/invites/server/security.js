Security.defineMethod("ifCreated", {
  fetch: ["uploader"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.uploader;
  }
});

Invites.permit(["insert"]).ifLoggedIn().apply();
Invites.permit(["update", "remove"]).ifLoggedIn().ifCreated().apply();
