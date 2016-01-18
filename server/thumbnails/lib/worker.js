thumbnailWorker = function (job, callback) {
  job.log("Beginning work on thumbnail: " + (job.data.inputFileId.toHexString()), {
    level: "info",
    data: {
      input: job.data.inputFileId,
      output: job.data.outputFileId,
      policy: job.data.policy,
      contentType: job.data.contentType
    },
    echo: true
  });

  job.progress(20, 100);

  var contentType = job.data.contentType.split("/");
  var backend;

  if (contentType[0] === "video") {
    backend = getVideoThumbnail;
  }

  if (contentType[0] === "image") {
    if (job.data.policy.preserveFormat) {
      backend = magickImageResize;
    } else {
      backend = sharpImageResize;
    }
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

  var inStream = media.findOneStream({ _id: job.data.inputFileId });
  if (! inStream) {
    job.fail("Input file not found", { fatal: true });
    return callback();
  }

  var outStream = media.upsertStream({
    _id: job.data.outputFileId
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
      { _id: job.data.outputFileId },
      { $set: { "metadata.thumbComplete": true } }
    );

    job.log("Finished work on thumbnail image: " + job.data.outputFileId, {
      level: "info",
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId,
        policy: job.data.policy,
        contentType: job.data.contentType
      },
      echo: true
    });

    job.done();

    callback();
  }));

  backend(inStream, outStream, job.data.policy.size[0], job.data.policy.size[1]);
};
