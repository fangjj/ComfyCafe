var jdenticon = Meteor.npmRequire("jdenticon");

generateDjenticon = function (userId, hash) {
  var size = thumbnailPolicies.avatar.large.size[0];
  var djent = jdenticon.toSvg(hash, size);

  var djentStream = media.upsertStream({
    filename: "djenticon.svg",
    contentType: "image/svg+xml",
    metadata: {
      owner: userId,
      avatarFor: userId,
      djenticon: true
    }
  }, function (err, file) {
    Meteor.users.update(
      { _id: userId },
      { $set: {
        "profile.defaultAvatar": file._id
      } }
    );
  });

  djentStream.write(djent);
  djentStream.end();
};
