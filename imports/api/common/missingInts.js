function missingInts(arr) {
  const perf = [];

  let last;
  _.each(arr, (v, i) => {
    if (typeof last !== "undefined") {
      if (v > last) {
        while (v - last > 1) {
          last += 1;
          perf.push(last);
        }
      }
    }
    perf.push(v);
    last = v;
  });

  return perf;
}

export default missingInts;
