isOwner = function (obj) {
  return obj.owner._id === Meteor.userId();
};
