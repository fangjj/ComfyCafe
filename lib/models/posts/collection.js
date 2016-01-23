Posts = new Mongo.Collection("posts");
Post = Astro.Class({
  name: "Post",
  collection: Posts,
  fields: {
    name: {
      type: "string"
    },
    uploader: {
      type: "object",
      default: function () {
        return {};
      }
    },
    private: {
      type: "boolean"
    },
    medium: {
      type: "object",
      default: function () {
        return {};
      }
    },
    favorited: {
      type: "array",
      default: function () {
        return [];
      }
    },
    tags: {
      type: "object"
    },
    humanizedTags: {
      type: "object"
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
