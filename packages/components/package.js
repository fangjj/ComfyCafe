Package.describe({
  name: "teru:components",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal common component package for TeruImages.",
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
    "react"
  ], ["client", "server"]);

  api.addFiles([
    "client/components/SpinnerComponent.jsx",
    "client/components/RainbowSpinnerComponent.jsx",
    "client/components/LoadingSpinnerComponent.jsx",
    "client/components/PowerlessComponent.jsx",
    "client/components/MainLayout.jsx",
  ], ["client"]);

  api.export([
    "SpinnerComponent",
    "RainbowSpinnerComponent",
    "LoadingSpinnerComponent",
    "PowerlessComponent",
    "MainLayout"
  ], ["client"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:components");
  api.addFiles("components-tests.js");
});
