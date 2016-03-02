Package.describe({
  name: "teru:names",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal name generator package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");

  api.use("ecmascript");

  api.addFiles([
    "adjectives.js",
    "nouns.js",
    "nsfwNouns.js",
    "nameGenerator.js"
  ], ["client", "server"]);

  api.export([
    "generateName"
  ], ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:names");
  api.addFiles("names-tests.js");
});
