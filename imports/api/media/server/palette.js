import _ from "lodash";
import fs from "fs";
import tmp from "tmp";
import tinycolor from "tinycolor2";
import nearestColor from "nearest-color";

import media from "../collection";
import colors from "../colors";

function getPalette(mediumId, callback) {
  const inStream = media.findOneStream({ _id: new Mongo.ObjectID(mediumId) });
  const tmpFile = tmp.fileSync();
  const wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);
  wstream.on("finish", Meteor.bindEnvironment(function () {
    attention(tmpFile.name).swatches(1).palette(
      (err, palette) => {
        tmpFile.removeCallback();
        _.each(palette.swatches, (swatch) => {
          const base = tinycolor(swatch.css).saturate(100).complement().toHexString();
          const nearest = nearestColor.from(colors)(base);
          callback(swatch.css, nearest);
        });
      }
    );
  }));
}

export default getPalette;
