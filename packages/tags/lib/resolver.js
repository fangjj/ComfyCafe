tagResolver = function (tag, callback) {
  doIt = function () {
    var canon = Tags.findOne(
      { $or: [
        { name: tag },
        { aliases: tag }
      ] }
    );

    var name = tag;
    if (canon) {
      name = canon.name;
    }

    callback(name);
  };

  if (Meteor.isClient) {
    Meteor.subscribe("tag", tag, doIt);
  } else {
    doIt();
  }
};
