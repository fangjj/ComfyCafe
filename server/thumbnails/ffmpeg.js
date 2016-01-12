var exec = Meteor.npmRequire("child_process").exec;
var fs = Meteor.npmRequire("fs");
var tmp = Meteor.npmRequire("tmp");

var ffmpegGetFirstFrame = function (inName, outName, callback) {
  exec(
    "ffmpeg -y -i " + inName + " -frames:v 1 " + outName,
    Meteor.bindEnvironment(callback)
  );
};

getVideoPreview = function (inStream, outStream, width, height) {
  var tmpFile = tmp.fileSync();
  var wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);

  wstream.on("finish", Meteor.bindEnvironment(function () {
    var tmpThumbFile = tmp.fileSync({ postfix: ".png" });

    ffmpegGetFirstFrame(tmpFile.name, tmpThumbFile.name, function (err) {
      getVideoThumbnail(tmpThumbFile, outStream, width, height);
    });
  }));
};

getVideoThumbnail = function (tmpThumbFile, outStream, width, height) {
  var rstream = fs.createReadStream(tmpThumbFile.name);
  return genericImageResize(rstream, outStream, 256, 256);
};
