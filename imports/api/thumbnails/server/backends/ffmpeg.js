import { exec } from "child_process";
import fs from "fs";
import tmp from "tmp";

import sharpImageResize from "./sharp.js";

function ffmpegGetFirstFrame(inName, outName, callback) {
  exec(
    "ffmpeg -y -i " + inName + " -frames:v 1 " + outName,
    Meteor.bindEnvironment(callback)
  );
};

function getVideoPreview(inStream, outStream, callback) {
  var tmpFile = tmp.fileSync();
  var wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);

  wstream.on("finish", Meteor.bindEnvironment(function () {
    var tmpPreviewFile = tmp.fileSync({ postfix: ".png" });

    ffmpegGetFirstFrame(tmpFile.name, tmpPreviewFile.name, function (err) {
      tmpFile.removeCallback();
      callback(tmpPreviewFile);
    });
  }));
};

export default function (inStream, outStream, width, height) {
  return getVideoPreview(inStream, outStream, function (tmpPreviewFile) {
    var rstream = fs.createReadStream(tmpPreviewFile.name);
    sharpImageResize(rstream, outStream, width, height);
    tmpPreviewFile.removeCallback();
  });
};
