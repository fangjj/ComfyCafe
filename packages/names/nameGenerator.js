var takeAdj = function (pool) {
  adj = _.sample(adjectives);
  if (_.contains(pool, adj)) {
    return takeAdj(pool);
  } else {
    return adj;
  }
};

generateName = function (delim, adjCount) {
  if (typeof delim === "undefined") {
    delim = "";
  }
  if (typeof adjCount === "undefined") {
    adjCount = 2;
  }

  adjs = [];
  for (var i = 0; i < adjCount; ++i) {
    adjs.push(takeAdj(adjs));
  }
  noun = _.sample(nouns);
  return adjs.join(delim) + delim + noun;
};
