import _ from "lodash";

import tagDiffer from "./differ";
import tagAdjOrder from "./adjOrder";
import tagRegenerator from "./regenerator";

function isRemoved(dDiff, rootNoun, tag) {
  return _.includes(dDiff[rootNoun].removed, tag);
}

function isRemovedFrom(dDiff, rootNoun, tag, adj) {
  return _.has(dDiff[rootNoun].removedFrom, tag)
    && _.includes(dDiff[rootNoun].removedFrom[tag], adj);
}

function isAdded(dDiff, rootNoun, tag) {
  return _.includes(dDiff[rootNoun].added, tag);
}

function isAddedTo(dDiff, rootNoun, tag, adj) {
  var has = _.has(dDiff[rootNoun].addedTo, tag);
  if (! adj) {
    return has;
  } else {
    return has && _.includes(dDiff[rootNoun].removedFrom[tag], adj);
  }
}

function remove(dTags, rootNoun, tag) {
  delete dTags.subjects[rootNoun][tag];
}

function removeFrom(dTags, rootNoun, tag, adj) {
  if (_.includes(dTags.subjects[rootNoun][tag], adj)) {
    var idx = dTags.subjects[rootNoun][tag].indexOf(adj);
    dTags.subjects[rootNoun][tag].splice(idx, 1);
  }
}

function add(dTags, rootNoun, tag) {
  if (! dTags.subjects[rootNoun][tag]) {
    dTags.subjects[rootNoun][tag] = [];
  }
}

function addTo(dTags, rootNoun, tag, adjs) {
  dTags.subjects[rootNoun][tag] = adjs;
}

function multiPusher(srcs, proc) {
  var combined = [];
  _.each(srcs, function (src) {
    combined.push.apply(combined, proc(src));
  });
  return _.uniq(combined);
}

function authorPusher(srcs) {
  return multiPusher(srcs, function (src) {
    return src.authors;
  });
}

function originPusher(srcs) {
  return multiPusher(srcs, function (src) {
    return src.origins;
  });
}

function tagPatcherDirect(diff, diffPreserve, adjOrder, target, authors, origins) {
  var output = {
    subjects: jsonClone(target.subjects),
    authors: authors || [],
    origins: origins || []
  };

  _.each(target.subjects, function (descriptors, rootNoun) {
    if (_.has(diff, rootNoun)) {
      _.each(diffPreserve[rootNoun].transmuted, function (next, prev) {
        diff[rootNoun].added = _.map(diff[rootNoun].added, function (val, idx) {
          if (val === prev) {
            return next;
          } return val;
        });

        diff[rootNoun].removed = _.map(diff[rootNoun].removed, function (val, idx) {
          if (val === prev) {
            return next;
          } return val;
        });

        _.each(diff[rootNoun].addedTo, function (adjs, descNoun) {
          if (descNoun === prev) {
            diff[rootNoun].addedTo[next] = diff[rootNoun].addedTo[prev];
            delete diff[rootNoun].addedTo[prev];
          }
        });

        _.each(diff[rootNoun].removedFrom, function (adjs, descNoun) {
          if (descNoun === prev) {
            diff[rootNoun].removedFrom[next] = diff[rootNoun].removedFrom[prev];
            delete diff[rootNoun].removedFrom[prev];
          }
        });
      });

      _.each(diff[rootNoun].added, function (tag) {
        if (! isRemoved(diffPreserve, rootNoun, tag)) {
          add(output, rootNoun, tag);
        }
      });

      _.each(diff[rootNoun].addedTo, function (adjs, descNoun) {
        if (! isRemoved(diffPreserve, rootNoun, descNoun)) {
          var notRemoved = _.filter(adjs, function (adj) {
            return ! isRemovedFrom(diffPreserve, rootNoun, descNoun, adj);
          });
          var targetAdjs = _.get(output.subjects, rootNoun + "." + descNoun, []);
          const merged = arrayMerge(
            targetAdjs,
            _.intersection(
              adjOrder[rootNoun][descNoun],
              _.union(notRemoved, targetAdjs)
            )
          );
          addTo(output, rootNoun, descNoun, merged);
        }
      });

      _.each(diff[rootNoun].removed, function (tag) {
        if (
          ! isAdded(diffPreserve, rootNoun, tag)
          && ! isAddedTo(diffPreserve, rootNoun, tag)
        ) {
          remove(output, rootNoun, tag);
        }
      });

      _.each(diff[rootNoun].removedFrom, function (adjs, tag) {
        if (! isAdded(diffPreserve, rootNoun, tag)) {
          _.each(adjs, function (adj) {
            if (! isAddedTo(diffPreserve, rootNoun, tag, adj)) {
              removeFrom(output, rootNoun, tag, adj);
            }
          });
        }
      });

      _.each(diff[rootNoun].transmuted, function (next, prev) {
        // Apply prev if reverse transmutation isn't in diffPreserve.
        const pairs = _.toPairs(diffPreserve[rootNoun].transmuted);
        if (! _.includes(pairs, [prev, next])) {
          output.subjects[rootNoun][next] = _.get(output.subjects[rootNoun], prev, []);
          delete output.subjects[rootNoun][prev];
        }
      });
    }
  });

  return tagRegenerator(output);
}

function tagPatcher(a, b, c) {
  const diffPreserve = tagDiffer(a, c);
  return tagPatcherDirect(
    tagDiffer(a, b),
    diffPreserve,
    tagAdjOrder(b, c),
    c,
    authorPusher([a, b, c]),
    originPusher([a, b, c])
  );
}

export default tagPatcher;
export { tagPatcherDirect };
