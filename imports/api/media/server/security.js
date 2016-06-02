import media from "../collection";
import isBanned from "/imports/api/users/isBanned";

media.allow({
   // The creator of a file owns it. UserId may be null.
   insert: function (userId, file) {
     // Assign the proper owner when a file is created
     check(userId, String);
     const user = Meteor.users.findOne({ _id: userId }, { bans: 1 });
     if (! user || isBanned(user)) {
       return false;
     }
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
