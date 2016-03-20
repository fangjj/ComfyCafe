fancySplit = function (str) {
  str = str.replace(",", " ").replace(":", " ").replace(";", " ");
  var distance = 0;
  return _.map(str.split(" "), function (value, idx) {
    var pair = [value, distance];
    distance += value.length + 1;
    return pair;
  });
};
