fancyCommaJoin = function (arr, map)
{
  if (! arr.length) {
    return "";
  }

  if (arr.length === 1) {
    return map(arr[0]);
  }

  if (arr.length === 2) {
    return map(arr[0]) + " and " + map(arr[1]);
  }

  var results = "";
  _.each(arr, function (value, index) {
    if (index < arr.length - 1) {
      results += map(value) + ", ";
    } else {
      results += "and " + map(value);
    }
  });
  return results;
};
