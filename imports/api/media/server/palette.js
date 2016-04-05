import _ from "lodash";
import fs from "fs";
import tmp from "tmp";

import media from "../collection";

function getPalette(mediumId, callback) {
  const inStream = media.findOneStream({ _id: new Mongo.ObjectID(mediumId) });
  const tmpFile = tmp.fileSync();
  const wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);
  wstream.on("finish", Meteor.bindEnvironment(function () {
    attention(tmpFile.name).swatches(1).palette(
      (err, palette) => {
        _.each(palette.swatches, (swatch) => {
          callback(swatch.css);
        });
      }
    );
  }));
}

export default getPalette;
