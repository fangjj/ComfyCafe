export default function (doc, userId, except, blocking) {
  let wrapped = {
    $and: [
      { $or: [
        { published: true }
      ] },
      doc
    ]
  };

  if (userId) {
    if (blocking && blocking.length) {
      wrapped.$and.push({ "owner._id": { $nin: blocking || [] } });
    }
    wrapped.$and[0].$or.push({ "owner._id": userId });
  }

  if (typeof except !== "undefined") {
    wrapped.$and[0].$or.push(except);
  }

  return wrapped;
};
