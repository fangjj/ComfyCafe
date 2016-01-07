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
      type: "string"
    },
    favorited: {
      type: "array",
      default: function () {
        return [];
      }
    }
  },
  behaviors: {
    timestamp: {
      hasCreatedField: true,
      createdFieldName: "createdAt",
      hasUpdatedField: true,
      updatedFieldName: "updatedAt"
    }
  }
});

media = new FileCollection("media",
  { resumable: true,
    http: [
      { method: "get",
        path: "/:md5",
        lookup: function (params, query) {
          return { md5: params.md5 };
        }
      }
    ]
  }
);

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
