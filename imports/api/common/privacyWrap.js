export default function (doc, userId, friends, except) {
  let wrapped = {
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

  if (typeof except !== "undefined") {
    wrapped.$and[0].$or.push(except);
  }

  return wrapped;
};
