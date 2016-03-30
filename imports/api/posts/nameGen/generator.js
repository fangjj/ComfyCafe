import _ from "lodash";

import adjectives from "./adjectives";
import nouns from "./nouns";

function takeAdj(pool) {
  const adj = _.sample(adjectives);
  if (_.includes(pool, adj)) {
    return takeAdj(pool);
  } else {
    return adj;
  }
};

function generateName(options) {
  if (typeof options === "undefined") {
    options = {};
  }

  if (typeof options.delim === "undefined") {
    options.delim = "";
  }
  if (typeof options.adjCount === "undefined") {
    options.adjCount = 2;
  }

  let adjs = [];
  for (let i = 0; i < options.adjCount; ++i) {
    adjs.push(takeAdj(adjs));
  }
  const noun = _.sample(nouns);
  return adjs.join(options.delim) + options.delim + noun;
};

export default generateName;
