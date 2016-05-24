import mongoid from "/imports/api/common/mongoid";

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

function extRemover(str) {
  const tokens = str.split(".");
  if (tokens.length > 1) {
    tokens.pop();
  }
  return tokens.join(".");
}

export default new FileCollection("media",
  { resumable: true,
    maxUploadSize: 64 * Math.pow(10, 6),
    http: [
      { method: "get",
        path: "/:md5",
        lookup: function (params, query) {
          params.md5 = extRemover(params.md5);
          return { md5: params.md5 };
        }
      },
      { method: "get",
        path: "/id/:id",
        lookup: lookupGenerator(function (params, query) {
          params.id = extRemover(params.id);
          const id = mongoid.new(params.id);
          return { $or: [
            { _id: id },
            { "metadata.thumbOf": id }
          ] };
        })
      },
      { method: "get",
        path: "/user/:userId",
        lookup: function (params, query) {
          params.userId = extRemover(params.userId);

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
          params.id = extRemover(params.id);

          const doc = lookupGenerator(function () {
            const id = mongoid.new(params.id);
            return { $or: [
              { _id: id },
              { "metadata.thumbOf": id }
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
          params.userId = extRemover(params.userId);

          return {
            "metadata.owner": params.userId,
            "metadata.djenticon": true
          };
        }
      },
      { method: "get",
        path: "/post/:postId",
        lookup: lookupGenerator(function (params, query) {
          params.postId = extRemover(params.postId);
          return { "metadata.post": params.postId };
        })
      }
    ]
  }
);
