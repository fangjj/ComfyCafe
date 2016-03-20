function beforeAfter(arr, idx) {
  var doc = {
    after: undefined,
    before: undefined
  };

  if (idx !== 0) {
    doc.after = arr[idx - 1];
  }

  if (idx !== arr.length - 1) {
    doc.before = arr[idx + 1];
  }

  return doc;
}

/*
Note that this differ is designed for arrays with unique items.
It works best for arrays of strings, since the value is turned into an object key.
*/
arrayDiffer = function (oldArr, newArr) {
  var diff = {
    added: {},
    moved: {},
    removed: {}
  };

  _.each(newArr, function (value, idx) {
    var oldIdx = oldArr.indexOf(value);
    if (oldIdx === -1) {
      // Added
      diff.added[value] = beforeAfter(newArr, idx);
    } else {
      // Still here. Did it move?
      if (oldIdx !== idx) {
        diff.moved[value] = beforeAfter(newArr, idx);
      }
    }
  });

  _.each(oldArr, function (value, idx) {
    var newIdx = newArr.indexOf(value);
    if (newIdx === -1) {
      // Removed
      diff.removed[value] = beforeAfter(oldArr, idx);
    }
  });

  return diff;
};
