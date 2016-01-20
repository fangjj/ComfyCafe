Security.defineMethod("ifCreated", {
  fetch: ["uploader"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.uploader;
  }
});
