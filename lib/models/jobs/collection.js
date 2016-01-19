jobs = new JobCollection("queue", {
  idGeneration: "MONGO",
  transform: function (d) {
    var e, res;
    try {
      res = new Job(jobs, d);
    } catch (_error) {
      e = _error;
      res = d;
    }
    return res;
  }
});
