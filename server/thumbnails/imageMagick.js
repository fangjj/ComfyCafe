var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});

genericImageResize = function (job, inStream, outStream, width, height, callback) {
  gm(inStream).resize(width, height).stream("png", Meteor.bindEnvironment(
    function (err, stdout, stderr) {
      stderr.pipe(process.stderr);
      stdout.pipe(outStream);
    }
  ));

  outStream.on("finish", Meteor.bindEnvironment(function () {
    job.progress(80, 100);

    media.update(
      { _id: job.data.inputFileId },
      { $set: { "metadata.thumbComplete": true } }
    );

    job.log("Finished work on thumbnail image: " + (job.data.outputFileId.toHexString()), {
      level: 'info',
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId,
        contentType: job.data.contentType
      },
      echo: true
    });
    job.done();

    return callback();
  }));
};
