Security.defineMethod("ifUploaded", {
  fetch: ["uploader"],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.uploader._id;
  }
});
