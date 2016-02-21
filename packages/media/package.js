Package.describe({
  name: "teru:media",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal media package for ComfyCafé.",
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
    "vsivsi:file-collection"
  ], ["client", "server"]);

  api.addFiles([
    "lib/collection.js",
    "lib/methods.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js",
    "server/publications.js"
  ], ["server"]);

  api.addFiles([
    "client/lib/eachFile.js"
  ], ["client"]);

  api.export("media", ["client", "server"]);
  api.export([
    "getFiles",
    "eachFile"
  ], ["client"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:media");
  api.addFiles("media-tests.js");
});
