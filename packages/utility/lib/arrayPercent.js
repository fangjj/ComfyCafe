arrayPercent = function (arr, value) {
  var idx = arr.indexOf(value);
  var start = Math.round(idx / arr.length * 100);
  var end = Math.round((idx + 1) / arr.length * 100);
  return [start, end];
};
