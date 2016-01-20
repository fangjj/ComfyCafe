thumbnailPolicies = {
  "postMedium": {
    "list": {
      size: [256, 256]
    }
  },
  "avatar": {
    "large": {
      size: [512, 512],
      // There's not presently a point in enabling this, since the cropper makes everything PNG.
      //preserveFormat: true
    },
    "small": {
      size: [81, 81],
      //preserveFormat: true
    },
    "topBar": {
      size: [50, 50],
      //preserveFormat: true
    },
    "favicon": {
      size: [16, 16]
    }
  }
};

if (Meteor.isServer) {
  _.each(thumbnailPolicies.postMedium, function (value, key) {
    value.success = function (job) {
      var orig = media.findOne({ _id: job.data.inputFileId });
      var thumb = media.findOne({ _id: job.data.outputFileId });
      var doc = { $set: {} };
      doc.$set["medium.thumbnails.fullsize"] = {
        _id: orig._id,
        md5: orig.md5
      };
      doc.$set["medium.thumbnails." + thumb.metadata.sizeKey] = {
        _id: thumb._id,
        md5: thumb.md5,
        size: thumb.metadata.size
      };
      Posts.update(
        { name: orig.metadata.post },
        doc
      );
    };

    value.fail = function (job) {
      var orig = media.findOne({ _id: job.data.inputFileId });
      var doc = { $set: {} };
      doc.$set["medium.thumbnails." + job.data.sizeKey] = {
        terminated: true
      };
      Posts.update(
        { name: orig.metadata.post },
        doc
      );
    };
  });

  _.each(thumbnailPolicies.avatar, function (value, key) {
    value.success = function (job) {
      var orig = media.findOne({ _id: job.data.inputFileId });
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

    value.fail = function (job) {};
  });
}
