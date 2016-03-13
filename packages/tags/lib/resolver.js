tagResolver = function (tag) {
  if (Meteor.isClient) {
    Meteor.subscribe("canonicalTag", tag);
  }

  var canon = Tags.findOne(
    { $or: [
      { name: tag },
      { aliases: tag }
    ] }
  );

  if (canon) {
    return canon.name;
  } else {
    return tag;
  }
};
