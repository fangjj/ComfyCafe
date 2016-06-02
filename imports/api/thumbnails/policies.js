import _ from "lodash";

import media from "/imports/api/media/collection";
import Posts from "/imports/api/posts/collection";
import { updateOwnerDocs } from "/imports/api/users/updateProfile";

const thumbnailPolicies = {
  "postMedium": {
    "list": {
      size: [240, 240]
    },

    "opengraph": {
      size: [1500, 1500]
    },
    "twitterCard": {
      size: [600, 321]
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
    "icon": {
      size: [36, 36]
    },
    "favicon": {
      size: [16, 16]
    },

    "opengraph": {
      size: [1500, 1500]
    },
    "twitterCard": {
      size: [600, 321]
    }
  }
};

if (Meteor.isServer) {
  _.each(thumbnailPolicies.postMedium, function (value, key) {
    value.success = function (job) {
      const orig = media.findOne({ _id: job.data.inputFileId });
      Posts.update(
        { "medium._id": job.data.inputFileId },
        { $set: { "medium.thumbsComplete": orig.metadata.thumbsComplete } }
      );
    };

    value.fail = function (job) {
      const orig = media.findOne({ _id: job.data.inputFileId });
      Posts.update(
        { "medium._id": job.data.inputFileId },
        { $set: { "medium.thumbsTerminated": orig.metadata.thumbsTerminated } }
      );
    };
  });

  _.each(thumbnailPolicies.avatar, function (value, key) {
    value.success = function (job) {
      const orig = media.findOne({ _id: job.data.inputFileId });
      const thumb = media.findOne({ _id: job.data.outputFileId });
      const doc = { $set: {} };
      doc.$set["avatars.fullsize"] = {
        _id: orig._id,
        md5: orig.md5
      };
      doc.$set["avatars." + thumb.metadata.sizeKey] = {
        _id: thumb._id,
        md5: thumb.md5,
        size: thumb.metadata.size
      };
      doc.$set["profile.avatar._id"] = orig._id;
      Meteor.users.update(
        { _id: job.data.owner },
        doc
      );
      updateOwnerDocs(
        { "owner._id": job.data.owner },
        { $set: {
          "owner.profile.avatar._id": orig._id
        } }
      );
    };

    value.fail = function (job) {};
  });
}

export default thumbnailPolicies;
