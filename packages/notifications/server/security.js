Security.defineMethod("ifRecipient", {
  fetch: ["to"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.to;
  }
});

Notifications.permit(["remove"]).ifLoggedIn().ifRecipient().apply();
