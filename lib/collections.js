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
      type: "object",
      default: function () {
        return {};
      }
    },
    "medium._id": {
      type: "string"
    },
    "medium.url": {
      type: "string"
    },
    "medium.type": {
      type: "string"
    },
    "medium.size": {
      type: "number"
    },
    "medium.name": {
      type: "string"
    },
    "medium.originalName": {
      type: "string"
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
    },
    uploader: {
      type: "string"
    }
  }
});
