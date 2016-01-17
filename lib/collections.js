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

avatars = new FileCollection("avatars",
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

jobs = new JobCollection("queue", {
  idGeneration: "MONGO",
  transform: function (d) {
    var e, res;
    try {
      res = new Job(jobs, d);
    } catch (_error) {
      e = _error;
      res = d;
    }
    return res;
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
