var takeAdj = function (pool) {
  adj = _.sample(adjectives);
  if (_.contains(pool, adj)) {
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
  if (typeof options.nsfw === "undefined") {
    options.nsfw = false;
  }

  var adjs = [];
  for (var i = 0; i < options.adjCount; ++i) {
    adjs.push(takeAdj(adjs));
  }
  var noun;
  if (! options.nsfw) {
    noun = _.sample(nouns);
  } else {
    noun = _.sample(nouns.concat(nsfwNouns));
  }
  return adjs.join(options.delim) + options.delim + noun;
};
