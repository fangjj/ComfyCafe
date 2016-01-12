var exec = Meteor.npmRequire("child_process").exec;
var fs = Meteor.npmRequire("fs");
var tmp = Meteor.npmRequire("tmp");

getVideoPreview = function (job, callback) {
  var inStream = media.findOneStream({
    _id: job.data.inputFileId
  });

  job.progress(20, 100);

  var outStream = media.upsertStream({
    _id: job.data.outputFileId
  });

  job.progress(80, 100);

  var tmpFile = tmp.fileSync();
  var wstream = fs.createWriteStream(tmpFile.name);
  inStream.pipe(wstream);
  wstream.on("finish", Meteor.bindEnvironment(function () {
    var tmpThumbFile = tmp.fileSync({ postfix: ".png" });

    exec("ffmpeg -y -i " + tmpFile.name + " -frames:v 1 " + tmpThumbFile.name,
    Meteor.bindEnvironment(function(err) {
      var rstream = fs.createReadStream(tmpThumbFile.name);
      rstream.pipe(outStream);

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
    }));

    return callback();
  }));
};
