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
