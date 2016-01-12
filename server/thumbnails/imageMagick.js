var exec = Meteor.npmRequire("child_process").exec;
var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});

genericImageResize = function (job, cb, width, height) {
  return exec('gm version', Meteor.bindEnvironment(function(err) {
    if (err) {
      console.warn('ImageMagick is not installed!\n', err);
      job.fail("Error running ImageMagick: " + err, {
        fatal: true
      });
      return cb();
    }

    job.log("Beginning work on thumbnail image: " + (job.data.inputFileId.toHexString()), {
      level: 'info',
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId
      },
      echo: true
    });

    var inStream = media.findOneStream({
      _id: job.data.inputFileId
    });
    if (!inStream) {
      job.fail('Input file not found', {
        fatal: true
      });
      return cb();
    }

    job.progress(20, 100);

    return gm(inStream).resize(width, height).stream("png",
    Meteor.bindEnvironment(function (err, stdout, stderr) {
      var outStream;
      stderr.pipe(process.stderr);
      if (err) {
        job.fail("Error running ImageMagick: " + err, {
          fatal: true
        });
        return cb();
      } else {
        outStream = media.upsertStream({
          _id: job.data.outputFileId
        }, {}, function(err, file) {
          if (err) {
            job.fail("" + err);
          } else if (file.length === 0) {
            job.fail('Empty output from ImageMagick!');
          } else {
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
            job.done(file);
          }
          return cb();
        });
        if (!outStream) {
          job.fail('Output file not found');
          return cb();
        }
        return stdout.pipe(outStream);
      }
    }));
  }));
};
