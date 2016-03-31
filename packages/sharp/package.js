Package.describe({
  name: "comfysoft:sharp",
  version: "0.0.1",
  summary: "Wrapper package for sharp to prevent weird import errors.",
  git: "",
  documentation: "README.md"
});

Npm.depends({
  "sharp": "0.12.2"
});

Package.onUse(function(api) {
  api.versionsFrom("1.3");

  api.use("ecmascript");

  api.addFiles([
    "sharp.js"
  ], "server");

  api.export([
    "sharp"
  ], "server");
});
