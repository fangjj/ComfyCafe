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

      var rstream = fs.createReadStream(tmpThumbFile.name);
      rstream.pipe(outStream);
    });
  }));

  outStream.on("finish", Meteor.bindEnvironment(function () {
    job.progress(90, 100);

    media.update(
      { _id: job.data.inputFileId },
      { $set: { "metadata.thumbComplete": true } }
    );

    job.log("Finished work on thumbnail image: " + (job.data.outputFileId.toHexString()), {
      level: "info",
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId
      },
      echo: true
    });

    job.done();

    callback();
  }));
};
