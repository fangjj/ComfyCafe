// Change these later

Meteor.users.deny({
  update: function() {
    return true;
  }
});

Posts.permit(["insert", "update", "remove"]).ifLoggedIn().apply();

Media.files.permit(["insert", "update", "remove"]).ifLoggedIn().apply();
Media.allow({
  download: function(userId, fileObj) {
    return true;
  }
});
