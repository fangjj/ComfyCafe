export default function (doc, userId, friends, except, blocking) {
  let wrapped = {
    $and: [
      { $or: [
        { visibility: "public" }
      ] },
      doc
    ]
  };

  if (userId) {
    if (blocking && blocking.length) {
      wrapped.$and.push({ "owner._id": { $nin: blocking || [] } });
    }
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
