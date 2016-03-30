import _ from "lodash";

// Unit tests would be nice...

muxOr = function (arr) {
  console.log("WARNING: muxOr is deprecated, as its eager evaluation breaks expected behavior.", arr);
  return _.reduce(arr, function (memo, a) {
    return memo || a;
  });
}

muxAnd = function (arr) {
  console.log("WARNING: muxAnd is deprecated, as its eager evaluation breaks expected behavior. If you're using it to pull nested values that may be absent from an object, use _.get instead.", arr);
  return _.reduce(arr, function (memo, a) {
    return memo && a;
  });
}
