Package.describe({
  name: "comfysoft:jobs",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal jobs package for ComfyCafé.",
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
    "vsivsi:job-collection"
  ], ["client", "server"]);

  api.addFiles([
    "lib/collection.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js",
    "server/publications.js",
    "server/garbageCollection.js"
  ], ["server"]);

  api.export("jobs", ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:jobs");
  api.addFiles("jobs-tests.js");
});
