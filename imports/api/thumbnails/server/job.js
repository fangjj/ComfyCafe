import _ from "lodash";
import thumbnailWorker from "./worker";
import thumbnailPolicies from "../policies";
import jobs from "/imports/api/jobs/collection";
import media from "/imports/api/media/collection";

function addedFileJob(file) {
  return media.rawCollection().findAndModify(
    {
      _id: new MongoInternals.NpmModule.ObjectID(file._id.toHexString()),
      "metadata._Jobs": { $exists: false }
    },
    [],
    { $set: { "metadata._Jobs": [] } },
    // in case you forget what this is... https://docs.mongodb.org/manual/reference/write-concern/
    { w: 1 },
  Meteor.bindEnvironment(function (err, doc) {
    if (err) {
      return console.error("Error locking file document in job creation: ", err);
    }
    if (doc) {
      const outputMetadata = _.clone(file.metadata);
      delete outputMetadata.thumbnails;
      delete outputMetadata.thumbnailPolicy;
      let outputExt = ".png";
      let outputContentType = "image/png";

      const policy = thumbnailPolicies[file.metadata.thumbnailPolicy];
      const thumbnails = {};
      _.each(policy, function (config, key) {
        outputMetadata.sizeKey = key;
        outputMetadata.size = config.size;

        if (config.preserveFormat) {
          outputExt = "";
          outputContentType = file.contentType;
        }

        var outputFileId = media.insert({
          filename: key + "-" + file.filename + outputExt,
          contentType: outputContentType,
          metadata: outputMetadata
        });

        thumbnails[key] = outputFileId;

        const job = new Job(jobs, "makeThumb", {
          owner: file.metadata.owner,
          contentType: file.contentType,
          inputFileId: file._id,
          outputFileId: outputFileId,
          policyName: file.metadata.thumbnailPolicy,
          sizeKey: key
        });

        const jobId = job.delay(0).retry({
          wait: 20000,
          retries: 5
        }).save();

        if (jobId) {
          media.update(
            { _id: file._id },
            {
              $push: { "metadata._Jobs": jobId },
              $set: { "metadata.thumbnails": thumbnails }
            }
          );
          return media.update(
            { _id: outputFileId },
            { $set: {
              "metadata._Job": jobId,
              "metadata.thumbOf": file._id
            } }
          );
        } else {
          return console.error("Error saving new job for file " + file._id);
        }
      });
    }
  }));
}

function removedFileJob(file) {
  if (file.metadata) {
    _.each(file.metadata._Jobs, function (jobId) {
      const job = jobs.findOne(
        {
          _id: jobId,
          status: { $in: jobs.jobStatusCancellable }
        },
        { fields: { log: 0 } }
      );

      if (job) {
        console.log("Cancelling the job for the removed file!", job._id);
        job.cancel(function (err, res) {
          if (_.isObject(file.metadata.thumbnails)) {
            return media.remove({ _id: { $in: _.values(job.data.thumbnails) } });
          }
        });
      }
    });
  }

  if (file.metadata && _.isObject(file.metadata.thumbnails)) {
    return media.remove({ _id: { $in: _.values(file.metadata.thumbnails) } });
  }
};

function changedFileJob(newFile, oldFile) {
  if (oldFile.md5 !== newFile.md5 || ! newFile.metadata._Jobs) {
    if (oldFile.metadata._Jobs) {
      removedFileJob(oldFile);
    }
    return addedFileJob(newFile);
  }
}

const fileObserve = media.find(
  {
    "metadata._Resumable": { $exists: false },
    "metadata.thumbnailPolicy": { $exists: true },
    "metadata.complete": true
  }
).observe({
  added: addedFileJob,
  changed: changedFileJob,
  removed: removedFileJob
});

const workers = jobs.processJobs("makeThumb", {
  concurrency: 4,
  prefetch: 2,
  pollInterval: 1000000000
}, thumbnailWorker);

jobs.find({
  type: "makeThumb",
  status: "ready"
}).observe({
  added: function (doc) {
    return workers.trigger();
  }
});
