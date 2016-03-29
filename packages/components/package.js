Package.describe({
  name: "comfysoft:components",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal common component package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Npm.depends({
  "react-onclickoutside": "4.5.0"
});

Package.onUse(function(api) {
  api.versionsFrom("1.3");

  api.use([
    "ecmascript",
  ], ["client", "server"]);

  api.addFiles([
    "client/lib/client.browserify.js",
    "client/components/SpinnerComponent.jsx",
    "client/components/RainbowSpinnerComponent.jsx",
    "client/components/LoadingSpinner.jsx",
    "client/components/PowerlessComponent.jsx",
    "client/components/Uhoh.jsx",
    "client/components/MainLayout.jsx",
  ], "client");

  api.export([
    "OnClickOutside",
    "SpinnerComponent",
    "RainbowSpinnerComponent",
    "LoadingSpinner",
    "PowerlessComponent",
    "Uhoh",
    "MainLayout"
  ], "client");
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:components");
  api.addFiles("components-tests.js");
});
