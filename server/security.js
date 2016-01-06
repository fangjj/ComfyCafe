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

media.allow({
   // The creator of a file owns it. UserId may be null.
   insert: function (userId, file) {
     // Assign the proper owner when a file is created
     file.metadata = file.metadata || {};
     file.metadata.owner = userId;
     return true;
   },
   remove: function (userId, file) {
     // Only owners can delete
     return (userId === file.metadata.owner);
   },
   read: function (userId, file) {
     //return (userId === file.metadata.owner);
     return true;
   },
   // This rule secures the HTTP REST interfaces' PUT/POST
   // Necessary to support Resumable.js
   write: function (userId, file, fields) {
     // Only owners can upload file data
     return (userId === file.metadata.owner);
   }
 });

Invites.permit(["insert"]).ifLoggedIn().apply();
Invites.permit(["update", "remove"]).ifLoggedIn().ifCreated().apply();
