var exec = Meteor.npmRequire("child_process").exec;
var fs = Meteor.npmRequire("fs");
var tmp = Meteor.npmRequire("tmp");

var ffmpegGetFirstFrame = function (inName, outName, callback) {
  exec(
    "ffmpeg -y -i " + inName + " -frames:v 1 " + outName,
    Meteor.bindEnvironment(callback)
  );
};

var getVideoPreview = function (inStream, outStream, callback) {
  var tmpFile = tmp.fileSync();
  var wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);

  wstream.on("finish", Meteor.bindEnvironment(function () {
    var tmpPreviewFile = tmp.fileSync({ postfix: ".png" });

    ffmpegGetFirstFrame(tmpFile.name, tmpPreviewFile.name, function (err) {
      callback(tmpPreviewFile);
    });
  }));
};

getVideoThumbnail = function (inStream, outStream, width, height) {
  return getVideoPreview(inStream, outStream, function (tmpPreviewFile) {
    var rstream = fs.createReadStream(tmpPreviewFile.name);
    sharpImageResize(rstream, outStream, width, height);
  });
};
