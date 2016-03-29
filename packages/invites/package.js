Package.describe({
  name: "comfysoft:invites",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal invites package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.3");

  api.use([
    "ecmascript",
    "mongo",
    "jaywon:meteor-node-uuid",
    "comfysoft:utility"
  ], ["client", "server"]);

  api.use([
    "comfysoft:components"
  ], ["client"]);

  api.addFiles([
    "lib/collection.js",
    "lib/methods.js",
  ], ["client", "server"]);

  api.addFiles([
    "server/publications.js"
  ], ["server"]);

  api.addFiles([
    "client/components/InviteComponent.jsx",
    "client/components/InviteFAB.jsx",
    "client/components/InviteListComponent.jsx",
    "client/views/InviteListView.jsx"
  ], ["client"]);

  api.export("Invites", ["client", "server"]);

  api.export("InviteListView", ["client"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:invites");
  api.addFiles("invites-tests.js");
});
