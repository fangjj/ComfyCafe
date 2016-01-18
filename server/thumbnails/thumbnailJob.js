var addedFileJob = function (file) {
  return media.rawCollection().findAndModify(
    {
      _id: new MongoInternals.NpmModule.ObjectID(file._id.toHexString()),
      "metadata._Job": { $exists: false }
    },
    [],
    { $set: { "metadata._Job": null } },
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
      var outputExt = ".png";
      var outputContentType = "image/png";

      var sizes = {};

      _.each(file.metadata.thumbnails, function (value, key) {
        if (! value) {
          outputMetadata.sizeKey = key;
          outputMetadata.size = _.map(key.slice(2).split("x"), function (n) {
            return parseInt(n);
          });

          var outputFileId = media.insert({
            filename: key + "-" + file.filename + outputExt,
            contentType: outputContentType,
            metadata: outputMetadata
          });

          file.metadata.thumbnails[key] = outputFileId;
          sizes[key] = outputFileId;
        }
      });

      var job = new Job(jobs, "makeThumb", {
        owner: file.metadata.owner,
        contentType: file.contentType,
        inputFileId: file._id,
        sizes: sizes
      });

      var jobId = job.delay(0).retry({
        wait: 20000,
        retries: 5
      }).save();

      if (jobId) {
        media.update(
          { _id: file._id },
          { $set: {
            "metadata._Job": jobId,
            "metadata.thumbnails": file.metadata.thumbnails
          } }
        );
        return media.update(
          { _id: { $in: _.values(sizes) } },
          { $set: {
            "metadata._Job": jobId,
            "metadata.thumbOf": file._id
          } }
        );
      } else {
        return console.error("Error saving new job for file " + file._id);
      }
    }
  }));
};

var removedFileJob = function (file) {
  if (file.metadata && file.metadata._Job) {
    var job = jobs.findOne(
      {
        _id: file.metadata._Job,
        status: { $in: jobs.jobStatusCancellable }
      },
      { fields: { log: 0 } }
    );

    if (job) {
      console.log("Cancelling the job for the removed file!", job._id);
      job.cancel(function (err, res) {
        return media.remove({ _id: job.data.outputFileId });
      });
    }
  }

  if (file.metadata && file.metadata.thumb) {
    return media.remove({ _id: file.metadata.thumb });
  }
};

var changedFileJob = function(oldFile, newFile) {
  if (oldFile.md5 !== newFile.md5) {
    if (oldFile.metadata._Job !== null) {
      removedFileJob(oldFile);
    }
    return addedFileJob(newFile);
  }

  if (_.contains(_.values(newFile.metadata.thumbnails), null)) {
    return addedFileJob(newFile);
  }
};

var fileObserve = media.find(
  {
    "metadata._Resumable": { $exists: false },
    "metadata.thumbnails": { $exists: true },
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
