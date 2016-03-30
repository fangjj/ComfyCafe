import jdenticon from "jdenticon";

import thumbnailPolicies from "/imports/api/thumbnails/policies";

export default function (userId, hash) {
  const size = thumbnailPolicies.avatar.large.size[0];
  const djent = jdenticon.toSvg(hash, size);

  const djentStream = media.upsertStream({
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
        defaultAvatar: file._id
      } }
    );
  });

  djentStream.write(djent);
  djentStream.end();
};
