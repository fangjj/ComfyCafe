privacyWrap = function (doc, userId) {
  return {
    $and: [
      { $or: [
        { visibility: { $ne: "unlisted" } },
        { "owner._id": userId }
      ] },
      doc
    ]
  };
};
