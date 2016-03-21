function extendsName(name) {
  var extensions = [];
  extensions.push(name);
  var extTags = Tags.find({
    extends: name
  }).fetch();
  _.each(extTags, function (ext) {
    extensions.push(ext.name);
  });
  return extensions;
}

tagExtensions = function (name) {
  var tag = Tags.findOne({ $or: [
    { name: name },
    { aliases: name }
  ] });

  if (! tag) {
    return extendsName(name);
  } else {
    return extendsName(tag.name);
  }
};
