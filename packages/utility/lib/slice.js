// Python-style slicing.

slice = function (collection, start, end, step) {
	// by Dagg via http://codereview.stackexchange.com/a/57270

  var slice = collection.slice || Array.prototype.slice,
      sliced = slice.call(collection, start, end),
      result, length, i;

  if (!step) {
    return sliced;
  }

  result = [];
  length = sliced.length;
  i = (step > 0) ? 0 : length - 1;
  for (; i < length && i >= 0; i += step) {
      result.push(sliced[i]);
  }

  return typeof collection == "string" ? result.join("") : result;
};
