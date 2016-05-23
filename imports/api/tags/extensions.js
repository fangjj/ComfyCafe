import _ from "lodash";

import Tags from "./collection";

function extendsName(name) {
  const extensions = [];
  extensions.push(name);

  Tags.find({
    extends: name
  }).map((ext) => {
    pushApply(extensions, extendsName(ext.name));
  });

  return extensions;
}

function tagExtensions(name) {
  if (! name) {
    return [];
  }

  const tag = Tags.findOne({ $or: [
    { name: name },
    { aliases: name }
  ] });

  if (! tag) {
    return extendsName(name);
  } else {
    return extendsName(tag.name);
  }
}

export default tagExtensions;
