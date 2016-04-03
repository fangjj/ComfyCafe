import _ from "lodash";

import Tags from "./collection";
import tagRegenerator from "./regenerator";

function tagResolver(tag) {
  var canon = Tags.findOne(
    { $or: [
      { name: tag },
      { aliases: tag }
    ] }
  );

  var name = tag;
  if (canon) {
    name = canon.name;
  }

  return name;
}

function tagFullResolver(parsed) {
  var output = {
    subjects: _.cloneDeep(parsed.subjects),
    authors: _.cloneDeep(parsed.authors),
    origins: _.cloneDeep(parsed.origins)
  };

  _.each(output.subjects, function (descriptors, rootNoun) {
    var canonRoot = tagResolver(rootNoun);
    if (canonRoot !== rootNoun) {
      output.subjects[canonRoot] = descriptors;
      delete output.subjects[rootNoun];
    }

    _.each(descriptors, function (adjs, descNoun) {
      output.subjects[canonRoot][descNoun] = [];

      var canonDesc = tagResolver(descNoun);
      if (canonDesc !== descNoun) {
        output.subjects[canonRoot][canonDesc] = [];
        delete output.subjects[canonRoot][descNoun];
      }

      _.each(adjs, function (adj) {
        output.subjects[canonRoot][canonDesc].push(tagResolver(adj));
      });
    });
  });

  return tagRegenerator(output);
}

export {
  tagResolver,
  tagFullResolver
};
