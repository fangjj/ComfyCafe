privacyWrap = function (doc, userId) {
  return {
    $and: [
      { $or: [
        { visibility: "public" },
        { "owner._id": userId }
      ] },
      doc
    ]
  };
};
