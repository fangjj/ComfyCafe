/*
Presently largely copy-pasted from
https://github.com/vsivsi/meteor-file-job-sample-app/blob/master/LICENSE

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

jobs.setLogStream(process.stdout);
jobs.promote(2500);
jobs.startJobServer();

var addedFileJob = function(file) {
  return media.rawCollection().findAndModify({
    _id: new MongoInternals.NpmModule.ObjectID(file._id.toHexString()),
    'metadata._Job': {
      $exists: false
    }
  }, [], {
    $set: {
      'metadata._Job': null
    }
  }, {
    w: 1
  }, Meteor.bindEnvironment(function(err, doc) {
    var job, jobId, outputFileId;
    if (err) {
      return console.error("Error locking file document in job creation: ", err);
    }
    if (doc) {
      if (! _.contains(["image", "video"], file.contentType.split("/")[0])) {
        return console.error('Input file is not supported: ' + file.contentType);
      }

      outputFileId = media.insert({
        filename: "tn_" + file.filename + ".png",
        contentType: 'image/png',
        metadata: file.metadata
      });
      job = new Job(jobs, 'makeThumb', {
        owner: file.metadata.owner,
        contentType: file.contentType,
        inputFileId: file._id,
        outputFileId: outputFileId
      });
      if (jobId = job.delay(5000).retry({
        wait: 20000,
        retries: 5
      }).save()) {
        media.update({
          _id: file._id
        }, {
          $set: {
            'metadata._Job': jobId,
            'metadata.thumb': outputFileId
          }
        });
        return media.update({
          _id: outputFileId
        }, {
          $set: {
            'metadata._Job': jobId,
            'metadata.thumbOf': file._id
          }
        });
      } else {
        return console.error("Error saving new job for file " + file._id);
      }
    }
  }));
};

var removedFileJob = function (file) {
  var job, ref, ref1, thumb;
  if ((ref = file.metadata) != null ? ref._Job : void 0) {
    if (job = jobs.findOne({
      _id: file.metadata._Job,
      status: {
        $in: jobs.jobStatusCancellable
      }
    }, {
      fields: {
        log: 0
      }
    })) {
      console.log("Cancelling the job for the removed file!", job._id);
      job.cancel(function(err, res) {
        return media.remove({
          _id: job.data.outputFileId
        });
      });
    }
  }
  if (((ref1 = file.metadata) !== null ? ref1.thumb : void 0) !== null) {
    return thumb = media.remove({
      _id: file.metadata.thumb
    });
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

var fileObserve = media.find({
  "metadata._Resumable": {
    $exists: false
  },
  "metadata.thumbOf": {
    $exists: false
  },
  "metadata.post": {
    $exists: true
  }
}).observe({
  added: addedFileJob,
  changed: changedFileJob,
  removed: removedFileJob
});

var worker = function (job, cb) {
  job.log("contentType: " + job.data.contentType, {
    level: "info",
    data: {
      input: job.data.inputFileId,
      output: job.data.outputFileId
    },
    echo: true
  });

  if (job.data.contentType.split("/")[0] === "video") {
    return getVideoPreview(job, cb);
  }

  if (job.data.contentType.split("/")[0] === "image") {
    return genericImageResize(job, cb, 256, 256);
  }

  job.fail("Input file is not supported: " + job.data.contentType, {
    fatal: true
  });
  media.update(
    { _id: job.data.outputFileId },
    { $set: { "metadata.terminated": true } }
  );
  return cb();
};

var workers = jobs.processJobs("makeThumb", {
  concurrency: 4,
  prefetch: 2,
  pollInterval: 1000000000
}, worker);

jobs.find({
  type: "makeThumb",
  status: "ready"
}).observe({
  added: function (doc) {
    return workers.trigger();
  }
});
