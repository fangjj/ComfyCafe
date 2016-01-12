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

var exec = Meteor.npmRequire("child_process").exec;
var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});
var fs = Meteor.npmRequire("fs");
var tmp = Meteor.npmRequire("tmp");

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
    return function () {
      var inStream = media.findOneStream({
        _id: job.data.inputFileId
      });

      job.progress(20, 100);

      var outStream = media.upsertStream({
        _id: job.data.outputFileId
      });

      job.progress(80, 100);

      var tmpFile = tmp.fileSync();
      var wstream = fs.createWriteStream(tmpFile.name);
      inStream.pipe(wstream);
      wstream.on("finish", Meteor.bindEnvironment(function () {
        var tmpThumbFile = tmp.fileSync({ postfix: ".png" });

        exec("ffmpeg -y -i " + tmpFile.name + " -frames:v 1 " + tmpThumbFile.name,
        Meteor.bindEnvironment(function(err) {
          var rstream = fs.createReadStream(tmpThumbFile.name);
          rstream.pipe(outStream);

          media.update(
            { _id: job.data.inputFileId },
            { $set: { "metadata.thumbComplete": true } }
          );

          job.log("Finished work on thumbnail image: " + (job.data.outputFileId.toHexString()), {
            level: "info",
            data: {
              input: job.data.inputFileId,
              output: job.data.outputFileId
            },
            echo: true
          });

          job.done();
        }));

        return cb();
      }));
    }();
  }

  if (job.data.contentType.split("/")[0] === "image") {
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

      return gm(inStream).resize(256, 256).stream("png",
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
