Package.describe({
  name: "comfysoft:tags",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal tags package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");

  api.use([
    "ecmascript",
    "mongo",
    "comfysoft:utility"
  ], ["client", "server"]);

  api.addFiles([
    "lib/collection.js",
    "lib/aliases.js",
    "lib/stringify.js",
    "lib/tokenizer.js",
    "lib/parser.js",
    "lib/regenerator.js",
    "lib/resolver.js",
    "lib/differ.js",
    "lib/adjOrder.js",
    "lib/patcher.js",
    "lib/renamer.js",
    "lib/extensions.js",
    "lib/query.js",
    "lib/urlify.js"
  ], ["client", "server"]);

  api.export([
    "Tags",
    "tagAliasSample",
    "tagParseAliases",
    "tagStringify",
    "tagChunkStringify",
    "tagStrSample",
    "tagTopLevelTokenizer",
    "tagSubjectTokenizer",
    "tagDescriptorTokenizer",
    "tagParser",
    "tagRegenerator",
    "tagResolver",
    "tagFullResolver",
    "tagDiffer",
    "tagAdjOrder",
    "tagPatcherDirect",
    "tagPatcher",
    "tagRenamer",
    "tagExtensions",
    "tagQuery",
    "tagStrToUrl",
    "tagStrFromUrl"
  ], ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:tags");
  api.addFiles("tags-tests.js");
});
