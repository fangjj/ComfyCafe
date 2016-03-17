Package.describe({
  name: "teru:tags",
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
    "teru:utility"
  ], ["client", "server"]);

  api.addFiles([
    "lib/aliases.js",
    "lib/resolver.js",
    "lib/stringify.js",
    "lib/tokenizer.js",
    "lib/parser.js",
    "lib/differ.js",
    "lib/patcher.js",
    "lib/renamer.js",
    "lib/query.js",
    "lib/urlify.js"
  ], ["client", "server"]);

  api.export([
    "aliasSample",
    "parseAliases",
    "tagResolver",
    "tagStringify",
    "tagChunkStringify",
    "tagStrSample",
    "tagTopLevelTokenizer",
    "tagSubjectTokenizer",
    "tagDescriptorTokenizer",
    "tagParser",
    "tagDiffer",
    "tagPatcherDirect",
    "tagPatcher",
    "tagRenamer",
    "tagQuery",
    "tagStrToUrl",
    "tagStrFromUrl"
  ], ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:tags");
  api.addFiles("tags-tests.js");
});
