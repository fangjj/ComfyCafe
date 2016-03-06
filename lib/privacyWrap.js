privacyWrap = function (doc, userId, friends) {
  var wrapped = {
    $and: [
      { $or: [
        { visibility: "public" }
      ] },
      doc
    ]
  };

  if (userId) {
    wrapped.$and[0].$or.push({ "owner._id": userId });
    wrapped.$and[0].$or.push({
      "owner._id": { $in: friends || [] },
      visibility: "friends"
    });
  }

  return wrapped;
};
