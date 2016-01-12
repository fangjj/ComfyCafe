var exec = Meteor.npmRequire("child_process").exec;
var fs = Meteor.npmRequire("fs");
var tmp = Meteor.npmRequire("tmp");

var ffmpegGetFirstFrame = function (inName, outName, callback) {
  exec(
    "ffmpeg -y -i " + inName + " -frames:v 1 " + outName,
    Meteor.bindEnvironment(callback)
  );
};

getVideoPreview = function (job, inStream, outStream, callback) {
  var tmpFile = tmp.fileSync();
  var wstream = fs.createWriteStream(tmpFile.name);

  inStream.pipe(wstream);

  wstream.on("finish", Meteor.bindEnvironment(function () {
    job.progress(40, 100);

    var tmpThumbFile = tmp.fileSync({ postfix: ".png" });

    ffmpegGetFirstFrame(tmpFile.name, tmpThumbFile.name, function (err) {
      job.progress(80, 100);
      getVideoThumbnail(job, tmpThumbFile, outStream, callback);
    });
  }));
};

getVideoThumbnail = function (job, tmpThumbFile, outStream, callback) {
  var rstream = fs.createReadStream(tmpThumbFile.name);
  return genericImageResize(job, rstream, outStream, 256, 256, callback);
};
