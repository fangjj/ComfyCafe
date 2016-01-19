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
