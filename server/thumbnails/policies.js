var avatarCallback = function (job) {
  var orig = media.findOne({ _id: job.data.outputFileId });
  var thumb = media.findOne({ _id: job.data.outputFileId });
  var doc = { $set: {} };
  doc.$set["profile.avatars.fullsize"] = {
    _id: orig._id,
    md5: orig.md5
  };
  doc.$set["profile.avatars." + thumb.metadata.sizeKey] = {
    _id: thumb._id,
    md5: thumb.md5,
    size: thumb.metadata.size
  };
  Meteor.users.update(
    { _id: job.data.owner },
    doc
  );
};

thumbnailPolicies = {
  "postMedium": {
    "list": {
      size: [256, 256]
    }
  },
  "avatar": {
    "large": {
      size: [512, 512],
      preserveFormat: true,
      success: avatarCallback
    },
    "topBar": {
      size: [50, 50],
      preserveFormat: true,
      success: avatarCallback
    },
    "favicon": {
      size: [16, 16],
      success: avatarCallback
    }
  }
};
