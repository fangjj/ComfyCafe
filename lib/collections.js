User = Astro.Class({
  name: "User",
  collection: Meteor.users,
  transform: false,
  fields: {
    username: "string",
    emails: "array",
    services: "object",
    createdAt: "date",
    profile: {
      type: "object",
      default: function () {
        return {};
      }
    }
  }
});

Invites = new Mongo.Collection("invites");
Invite = Astro.Class({
  name: "Invite",
  collection: Invites,
  fields: {
    key: {
      type: "string"
    }
  }
});

Posts = new Mongo.Collection("posts");
Post = Astro.Class({
  name: "Post",
  collection: Posts,
  fields: {
    name: {
      type: "string"
    },
    uploader: {
      type: "string"
    },
    medium: {
      type: "string"
    }
  }
});

var mediaStore = new FS.Store.GridFS("media");
Media = new FS.Collection("media", {
  stores: [mediaStore]
});
