var lookupGenerator = function (docGen) {
  return function (params, query) {
    var thumb = query.thumb;
    var doc = docGen(params, query);
    if (! thumb) {
      doc["metadata.thumbnailPolicy"] = { $exists: true };
    } else {
      doc["metadata.sizeKey"] = thumb;
    }
    return doc;
  };
};

media = new FileCollection("media",
  { resumable: true,
    http: [
      { method: "get",
        path: "/:md5",
        lookup: function (params, query) {
          return { md5: params.md5 };
        }
      },
      { method: "get",
        path: "/user/:userId",
        lookup: lookupGenerator(function (params, query) {
          return {
            "metadata.owner": params.userId,
            // Not the cleanest thing, but clean enough for now.
            "metadata.post": { $exists: false }
          };
        })
      },
      { method: "get",
        path: "/djent/:userId",
        lookup: function (params, query) {
          return {
            "metadata.owner": params.userId,
            // Not the cleanest thing, but clean enough for now.
            "metadata.thumbnailPolicy": { $exists: false },
            "contentType": "image/svg+xml"
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
