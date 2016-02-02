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
        lookup: function (params, query) {
          var thumb = query.thumb;
          var doc = {
            "metadata.owner": params.userId,
            // Not the cleanest thing, but clean enough for now.
            "metadata.post": { $exists: false }
          };
          if (! thumb) {
            doc["metadata.thumbnailPolicy"] = { $exists: true };
          } else {
            doc["metadata.sizeKey"] = thumb;
          }
          return doc;
        }
      },
      { method: "get",
        path: "/post/:postId",
        lookup: function (params, query) {
          var thumb = query.thumb;
          var doc = { "metadata.post": params.postId };
          if (! thumb) {
            doc["metadata.thumbnailPolicy"] = { $exists: true };
          } else {
            doc["metadata.sizeKey"] = thumb;
          }
          return doc;
        }
      }
    ]
  }
);
