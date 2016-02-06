Package.describe({
  name: "teru:tags",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal tags package for TeruImages.",
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
    "teru:utility"
  ], ["client", "server"]);

  api.addFiles([
    "lib/parser.js",
    "lib/humanizer.js",
    "lib/query.js",
    "lib/urlify.js"
  ], ["client", "server"]);

  api.addFiles([
    "client/lib/tagTreeToStr.js"
  ], ["client"]);

  api.export([
    "parseTagStr",
    "getDefaultTagObj",
    "humanizeTags",
    "humanizeTagStr",
    "queryTagsGenerator",
    "tagStrToUrl",
    "tagStrFromUrl"
  ], ["client", "server"]);

  api.export([
    "tagTreeToStr",
  ], ["client"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:tags");
  api.addFiles("tags-tests.js");
});
