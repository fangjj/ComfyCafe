import thumbnailPolicies from "../policies";
import sharpImageResize from "./backends/sharp.js";
import magickImageResize from "./backends/imageMagick.js";
import getVideoThumbnail from "./backends/ffmpeg.js";
import media from "/imports/api/media/collection";

function thumbnailWorker(job, callback) {
  const policy = thumbnailPolicies[job.data.policyName][job.data.sizeKey];

  job.log("Beginning work on thumbnail: "
    + (job.data.inputFileId.toHexString()) + " (" + job.data.sizeKey + ")",
    {
      level: "info",
      data: {
        input: job.data.inputFileId,
        output: job.data.outputFileId,
        policy: policy,
        contentType: job.data.contentType
      },
      echo: true
    }
  );

  job.progress(20, 100);

  const contentType = job.data.contentType.split("/");
  let backend;

  if (contentType[0] === "video") {
    backend = getVideoThumbnail;
  }

  if (contentType[0] === "image") {
    if (policy.preserveFormat && contentType[1] !== "png") {
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
      { _id: job.data.outputFileId },
      { $set: { "metadata.thumbTerminated": true } }
    );

    media.update(
      { _id: job.data.inputFileId },
      { $addToSet: { "metadata.thumbsTerminated": job.data.policyName } },
    );

    policy.fail(job);
    return callback();
  }

  const inStream = media.findOneStream({ _id: job.data.inputFileId });
  if (! inStream) {
    job.fail("Input file not found", { fatal: true });
    policy.fail(job);
    return callback();
  }

  const outStream = media.upsertStream({
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
    policy.fail(job);
    return callback();
  }
  outStream.on("finish", Meteor.bindEnvironment(function () {
    job.progress(90, 100);

    media.update(
      { _id: job.data.outputFileId },
      { $set: { "metadata.thumbComplete": true } }
    );

    media.update(
      { _id: job.data.inputFileId },
      { $addToSet: { "metadata.thumbsComplete": job.data.sizeKey } }
    );

    job.log("Finished work on thumbnail: "
      + job.data.outputFileId + " (" + job.data.sizeKey + ")",
      {
        level: "info",
        data: {
          input: job.data.inputFileId,
          output: job.data.outputFileId,
          policy: policy,
          contentType: job.data.contentType
        },
        echo: true
      }
    );

    job.done();
    policy.success(job);
    callback();
  }));

  try {
    backend(inStream, outStream, policy.size[0], policy.size[1]);
  } catch (e) {
    job.fail(e.message, { fatal: true });
  }
}

export default thumbnailWorker;
