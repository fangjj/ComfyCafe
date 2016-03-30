function lookupGenerator(docGen) {
  return function (params, query) {
    const size = query.size;
    const doc = docGen(params, query);
    if (! size) {
      doc["metadata.thumbnailPolicy"] = { $exists: true };
    } else {
      doc["metadata.sizeKey"] = size;
    }
    return doc;
  };
};

export default new FileCollection("media",
  { resumable: true,
    http: [
      { method: "get",
        path: "/:md5",
        lookup: function (params, query) {
          return { md5: params.md5 };
        }
      },
      { method: "get",
        path: "/id/:id",
        lookup: lookupGenerator(function (params, query) {
          return { $or: [
            { _id: new Mongo.ObjectID(params.id) },
            { "metadata.thumbOf": new Mongo.ObjectID(params.id) }
          ] };
        })
      },
      { method: "get",
        path: "/user/:userId",
        lookup: function (params, query) {
          const doc = lookupGenerator(function () {
            return {};
          })(params, query);

          return {
            "metadata.avatarFor": params.userId,
            $or: [
              doc,
              { "metadata.djenticon": true }
            ]
          };
        }
      },
      { method: "get",
        path: "/user/:userId/:id",
        lookup: function (params, query) {
          const doc = lookupGenerator(function () {
            return { $or: [
              { _id: new Mongo.ObjectID(params.id) },
              { "metadata.thumbOf": new Mongo.ObjectID(params.id) }
            ] };
          })(params, query);

          return {
            "metadata.avatarFor": params.userId,
            $or: [
              doc,
              { "metadata.djenticon": true }
            ]
          };
        }
      },
      { method: "get",
        path: "/djent/:userId",
        lookup: function (params, query) {
          return {
            "metadata.owner": params.userId,
            "metadata.djenticon": true
          };
        }
      },
      { method: "get",
        path: "/post/:postId",
        lookup: lookupGenerator(function (params, query) {
          return { "metadata.post": params.postId };
        })
      }
    ]
  }
);
