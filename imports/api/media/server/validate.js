import _ from "lodash";

import media from "/imports/api/media/collection";

const whitelist = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "video/webm",
  "video/mp4",
  "video/ogg",
  "audio/mp3",
  "audio/ogg"
];

function mediumValidate(mediumId, subset, callback) {
  const sublist = _.reduce(
    whitelist,
    (result, item) => {
      if (subset) {
        if (item.split("/")[0] == subset) {
          result.push(item);
        }
      } else {
        result.push(item);
      }
      return result;
    },
    []
  );

  const rstream = media.findOneStream({ _id: mediumId });
  let buff = new Buffer(0);
  rstream.on("data", Meteor.bindEnvironment(function (data) {
    buff = Buffer.concat([buff, data]);
  }));
  rstream.on("end", Meteor.bindEnvironment(function (data) {
    const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
    magic.detect(buff, Meteor.bindEnvironment(function (err, result) {
      if (err) throw err;
      const valid = _.includes(sublist, result);
      callback(result, valid);
    }));
  }));
}

export default mediumValidate;
