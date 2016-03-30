import _ from "lodash";

var takeAdj = function (pool) {
  adj = _.sample(adjectives);
  if (_.includes(pool, adj)) {
    return takeAdj(pool);
  } else {
    return adj;
  }
};

generateName = function (options) {
  if (typeof options === "undefined") {
    options = {};
  }

  if (typeof options.delim === "undefined") {
    options.delim = "";
  }
  if (typeof options.adjCount === "undefined") {
    options.adjCount = 2;
  }

  var adjs = [];
  for (var i = 0; i < options.adjCount; ++i) {
    adjs.push(takeAdj(adjs));
  }
  var noun = _.sample(nouns);
  return adjs.join(options.delim) + options.delim + noun;
};
