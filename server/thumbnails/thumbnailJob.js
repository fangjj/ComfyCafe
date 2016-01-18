/*
Partially copy-pasted from
https://github.com/vsivsi/meteor-file-job-sample-app/

Copyright (C) 2014-2015 by Vaughn Iverson

meteor-file-job-sample-app is free software released under the MIT/X11 license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var addedFileJob = function(file) {
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
      outputMetadata.master = false;
      var outputExt = "";
      var outputContentType = file.contentType;

      if (file.contentType.split("/")[0] === "video") {
        outputExt = ".png";
        outputContentType = "image/png";
      }

      var outputFileId = media.insert({
        filename: "tn_" + file.filename + outputExt,
        contentType: outputContentType,
        metadata: outputMetadata
      });

      var job = new Job(jobs, "makeThumb", {
        owner: file.metadata.owner,
        contentType: file.contentType,
        inputFileId: file._id,
        outputFileId: outputFileId
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
            "metadata.thumb": outputFileId
          } }
        );
        return media.update({
          _id: outputFileId
        }, {
          $set: {
            "metadata._Job": jobId,
            "metadata.thumbOf": file._id
          }
        });
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
};

var fileObserve = media.find(
  {
    "metadata._Resumable": { $exists: false },
    "metadata.master": true,
    "metadata.post": { $exists: true }
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
