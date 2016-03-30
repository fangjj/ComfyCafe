import jobs from "../collection";

jobs.allow({
  manager: function(userId, method, params) {
    var ids = params[0];
    if (! (typeof ids === "object" && ids instanceof Array)) {
      ids = [ids];
    }
    var numIds = ids.length;
    var numMatches = jobs.find(
      {
        _id: { $in: ids },
        "data.owner": userId
      }
    ).count();
    return numMatches === numIds;
  },
  jobRerun: function(userId, method, params) {
    var id = params[0];
    var numMatches = myJobs.find(
      {
        _id: id,
        "data.owner": userId
      }
    ).count();
    return numMatches === 1;
  },
  stopJobs: function(userId, method, params) {
    return userId !== null;
  }
});
