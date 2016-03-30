const jobs = new JobCollection("queue", {
  idGeneration: "MONGO",
  transform: function (d) {
    let e, res;
    try {
      res = new Job(jobs, d);
    } catch (_error) {
      e = _error;
      res = d;
    }
    return res;
  }
});

export default jobs;
