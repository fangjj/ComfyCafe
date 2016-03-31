import jobs from "../collection";

/*
Snagged from
https://github.com/vsivsi/meteor-job-collection-playground/blob/master/play.coffee#L443-L464

Copyright (C) 2015 by Vaughn Iverson

meteor-job-collection-playground is free software released under the MIT/X11 license:

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

new Job(jobs, "cleanup", {}).repeat({
  schedule: jobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});

q = jobs.processJobs("cleanup", {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function(job, callback) {
  var current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  var ids = jobs.find(
    {
      status: { $in: Job.jobStatusRemovable },
      updated: { $lt: current }
    },
    { fields: { _id: 1 } }
  ).map(function (d) {
    return d._id;
  });
  if (ids.length > 0) {
    jobs.removeJobs(ids);
  }
  job.done("Removed " + ids.length + " old jobs");
  return callback();
});

jobs.find({
  type: "cleanup",
  status: "ready"
}).observe({
  added: function() {
    return q.trigger();
  }
});
