Package.describe({
  name: "teru:notifications",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal notifications package for TeruImages.",
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

  api.use([
    "ongoworks:security"
  ], ["server"]);

  api.use([
    "react",
    "teru:components"
  ], ["client"]);

  api.addFiles([
    "lib/collection.js",
    "lib/methods.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js",
    "server/publications.js"
  ], ["server"]);

  api.addFiles([
    "client/components/NotificationButton.jsx",
    "client/components/NotificationComponent.jsx",
    "client/components/NotificationListComponent.jsx"
  ], ["client"]);

  api.export("Notifications", ["client", "server"]);

  api.export([
    "NotificationButton",
    "NotificationComponent",
    "NotificationListComponent"
  ], ["client"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:notifications");
  api.addFiles("notifications-tests.js");
});
