var addedFileJob = function (file) {
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
      if (! _.contains(["image", "video"], file.contentType.split("/")[0])) {
        return console.error("Input file is not supported: " + file.contentType);
      }

      var outputMetadata = _.clone(file.metadata);
      delete outputMetadata.thumbnails;
      delete outputMetadata.thumbnailPolicy;
      var outputExt = ".png";
      var outputContentType = "image/png";

      var policy = thumbnailPolicies[file.metadata.thumbnailPolicy];
      var thumbnails = {};
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

        var job = new Job(jobs, "makeThumb", {
          owner: file.metadata.owner,
          contentType: file.contentType,
          inputFileId: file._id,
          outputFileId: outputFileId,
          policyName: file.metadata.thumbnailPolicy,
          sizeKey: key
        });

        var jobId = job.delay(0).retry({
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
};

var removedFileJob = function (file) {
  if (file.metadata && file.metadata._Jobs) {
    var job = jobs.findOne(
      {
        _id: { $in: file.metadata._Jobs },
        status: { $in: jobs.jobStatusCancellable }
      },
      { fields: { log: 0 } }
    );

    if (job) {
      console.log("Cancelling the job for the removed file!", job._id);
      job.cancel(function (err, res) {
        return media.remove({ _id: { $in: _.values(job.data.thumbnails) } });
      });
    }
  }

  if (file.metadata && file.metadata.thumbnails) {
    return media.remove({ _id: { $in: _.values(file.metadata.thumbnails) } });
  }
};

var changedFileJob = function(oldFile, newFile) {
  if (oldFile.md5 !== newFile.md5) {
    if (oldFile.metadata._Jobs) {
      removedFileJob(oldFile);
    }
    return addedFileJob(newFile);
  }
};

var fileObserve = media.find(
  {
    "metadata._Resumable": { $exists: false },
    "metadata.thumbnailPolicy": { $exists: true },
    "metadata.bound": true
  }
).observe({
  added: addedFileJob,
  changed: changedFileJob,
  removed: removedFileJob
});

var workers = jobs.processJobs("makeThumb", {
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
