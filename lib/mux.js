// Unit tests would be nice...

muxOr = function (arr) {
  return _.reduce(arr, function (memo, a) {
    return memo || a;
  });
}

muxAnd = function (arr) {
  return _.reduce(arr, function (memo, a) {
    return memo && a;
  });
}
