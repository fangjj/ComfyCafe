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

function mediumValidate(mediumId, callback) {
  const rstream = media.findOneStream({ _id: mediumId });
  let buff = new Buffer(0);
  rstream.on("data", Meteor.bindEnvironment(function (data) {
    buff = Buffer.concat([buff, data]);
  }));
  rstream.on("end", Meteor.bindEnvironment(function (data) {
    const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
    magic.detect(buff, Meteor.bindEnvironment(function (err, result) {
      if (err) throw err;
      const valid = _.includes(whitelist, result);
      callback(result, valid);
    }));
  }));
}

export default mediumValidate;
