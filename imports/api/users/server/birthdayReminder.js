import _ from "lodash";

import jobs from "/imports/api/jobs/collection";
import Notifications from "/imports/api/notifications/collection";

new Job(jobs, "birthdayReminder", {}).repeat({
  schedule: jobs.later.parse.text("at 0:00") // UTC
}).save({ cancelRepeats: true });

q = jobs.processJobs("birthdayReminder", {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, callback) {
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);

  const msg = `${tomorrow.getMonth()+1}/${tomorrow.getDate()}`;

  Meteor.users.find(
    {
      "profile.birthday.month": tomorrow.getMonth()+1,
      "profile.birthday.day": tomorrow.getDate(),
    },
    { fields: { _id: 1, username: 1, profile: 1, friends: 1 } }
  ).map((user) => {
    _.each(user.friends || [], (friendId) => {
      Notifications.insert(
				{
					createdAt: new Date(),
					to: friendId,
					action: "birthdayReminder",
					owner: {
						_id: user._id,
						username: user.username,
						profile: user.profile
					},
					birthday: user.profile.birthday
				}
			);
    });
  });

  job.done(msg);
  console.log(msg);
  return callback();
});

jobs.find({
  type: "birthdayReminder",
  status: "ready"
}).observe({
  added: function() {
    return q.trigger();
  }
});
