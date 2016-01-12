var exec = Meteor.npmRequire("child_process").exec;
var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});

genericImageResize = function (job, inStream, outStream, width, height, callback) {
  return exec('gm version', Meteor.bindEnvironment(function(err) {
    if (err) {
      console.warn('ImageMagick is not installed!\n', err);
      job.fail("Error running ImageMagick: " + err, {
        fatal: true
      });
      return callback();
    }

    job.log("Beginning work on thumbnail image: " + (job.data.inputFileId.toHexString()), {
      level: 'info',
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId
      },
      echo: true
    });

    job.progress(20, 100);

    return gm(inStream).resize(width, height).stream("png",
    Meteor.bindEnvironment(function (err, stdout, stderr) {
      stderr.pipe(process.stderr);
      stdout.pipe(outStream);

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
            output: job.data.outputFileId
          },
          echo: true
        });
        job.done();

        return callback();
      }));
    }));
  }));
};
