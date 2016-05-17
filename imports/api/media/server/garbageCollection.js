import jobs from "/imports/api/jobs/collection";
import media from "/imports/api/media/collection";

new Job(jobs, "mediaGc", {}).repeat({
  schedule: jobs.later.parse.text("every 1 hour")
}).save({ cancelRepeats: true });

q = jobs.processJobs("mediaGc", {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, callback) {
  console.log("Running media garbage collector...");

  const oneWeekAgo = new Date();
  oneWeekAgo.setHours(oneWeekAgo.getHours() - 7 * 24);

  const ids = media.find(
    {
      "metadata.bound": { $ne: true },
      "metadata.djenticon": { $ne: true },
      uploadDate: { $lt: oneWeekAgo }
    },
    { fields: { _id: 1 } }
  ).map((d) => {
    return d._id;
  });
  if (ids.length > 0) {
    media.remove({ _id: { $in: ids } });
  }

  const msg = "Removed " + ids.length + " unused media.";
  job.done(msg);
  console.log(msg);

  return callback();
});

jobs.find({
  type: "mediaGc",
  status: "ready"
}).observe({
  added: function() {
    return q.trigger();
  }
});
