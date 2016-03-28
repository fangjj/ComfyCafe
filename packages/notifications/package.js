Package.describe({
  name: "comfysoft:notifications",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal notifications package for ComfyCafé.",
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
    "mongo"
  ], ["client", "server"]);

  api.addFiles([
    "lib/collection.js",
    "lib/methods.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/publications.js"
  ], ["server"]);

  api.export("Notifications", ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:notifications");
  api.addFiles("notifications-tests.js");
});
