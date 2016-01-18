thumbnailWorker = function (job, callback) {
  var inStream = media.findOneStream({ _id: job.data.inputFileId });
  if (! inStream) {
    job.fail("Input file not found", { fatal: true });
    return callback();
  }

  job.progress(20, 100);

  var contentType = job.data.contentType.split("/");
  var backend;

  if (contentType[0] === "video") {
    backend = getVideoThumbnail;
  }

  if (contentType[0] === "image") {
    backend = sharpImageResize;
  }

  if (! backend) {
    job.fail("Input file is not supported: " + job.data.contentType, {
      fatal: true
    });

    media.update(
      { _id: { $in: _.values(job.data.thumbnails) } },
      { $set: { "metadata.terminated": true } }
    );

    return callback();
  }

  _.each(job.data.thumbnails, function (outputFileId, key) {
    var size = thumbnailPolicies[job.data.thumbnailPolicy][key];

    job.log("Beginning work on thumbnail: " + (job.data.inputFileId.toHexString()), {
      level: "info",
      data: {
        input: job.data.inputFileId,
        output: outputFileId,
        size: size,
        contentType: job.data.contentType
      },
      echo: true
    });

    var outStream = media.upsertStream({
      _id: outputFileId
    }, {}, function (err, file) {
      if (err) {
        job.fail("" + err);
      } else if (file.length === 0) {
        job.fail("Empty output from thumbnail backend!");
      }
    });
    if (! outStream) {
      job.fail("Output file not found", { fatal: true });
      return callback();
    }
    outStream.on("finish", Meteor.bindEnvironment(function () {
      job.progress(90, 100);

      media.update(
        { _id: outputFileId },
        { $set: { "metadata.thumbComplete": true } }
      );

      job.log("Finished work on thumbnail image: " + outputFileId, {
        level: "info",
        data: {
          input: job.data.inputFileId,
          output: outputFileId,
          size: size,
          contentType: job.data.contentType
        },
        echo: true
      });

      // This is a problem
      job.done();

      callback();
    }));

    backend(inStream, outStream, size[0], size[1]);
  });
};
