Meteor.publish("jobs", function (clientUserId) {
  if (this.userId === clientUserId) {
    return jobs.find({ "data.owner": this.userId });
  } else {

  }
});
