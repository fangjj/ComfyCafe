// Change these later

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

Media.files.permit(["insert", "update"]).ifLoggedIn().apply();
Media.allow({
  download: function(userId, fileObj) {
    return true;
  }
});
