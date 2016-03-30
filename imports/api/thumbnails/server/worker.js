import thumbnailPolicies from "../policies";
import sharpImageResize from "./backends/sharp.js";
import magickImageResize from "./backends/imageMagick.js";
import getVideoThumbnail from "./backends/ffmpeg.js";

export default function (job, callback) {
  var policy = thumbnailPolicies[job.data.policyName][job.data.sizeKey];

  job.log("Beginning work on thumbnail: " + (job.data.inputFileId.toHexString()), {
    level: "info",
    data: {
      input: job.data.inputFileId,
      output: job.data.outputFileId,
      policy: policy,
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
    if (policy.preserveFormat) {
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
      { $set: { "metadata.terminated": true } }
    );

    policy.fail(job);
    return callback();
  }

  var inStream = media.findOneStream({ _id: job.data.inputFileId });
  if (! inStream) {
    job.fail("Input file not found", { fatal: true });
    policy.fail(job);
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
    policy.fail(job);
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
        policy: policy,
        contentType: job.data.contentType
      },
      echo: true
    });

    job.done();
    policy.success(job);
    callback();
  }));

  backend(inStream, outStream, policy.size[0], policy.size[1]);
};
