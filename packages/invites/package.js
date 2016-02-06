Package.describe({
  name: "teru:invites",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal invites package for TeruImages.",
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
    "iron:router",
    "jaywon:meteor-node-uuid",
    "teru:utility"
  ], ["client", "server"]);

  api.use([
    "ongoworks:security"
  ], ["server"]);

  api.use([
    "templating"
  ], ["client"]);

  api.addFiles([
    "lib/collection.js",
    "lib/methods.js",
    "lib/routes.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js",
    "server/publications.js"
  ], ["server"]);

  api.addFiles([
    "client/views/invites.html",
    "client/views/invites.js"
  ], ["client"]);

  api.export("Invites", ["client", "server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:invites");
  api.addFiles("invites-tests.js");
});
