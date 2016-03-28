Package.describe({
  name: "comfysoft:thumbnails",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal thumbnailing package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Npm.depends({
  "gm": "1.12.1",
  "sharp": "0.12.2",
  "tmp": "0.0.28"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");

  api.use([
    "ecmascript",
    "mongo",
    "vsivsi:job-collection",
    "comfysoft:media",
    "comfysoft:jobs"
  ], ["server"]);

  api.addFiles([
    "server/backends/imageMagick.js",
    "server/backends/sharp.js",
    "server/backends/ffmpeg.js",
    "server/worker.js",
    "server/thumbnailJob.js"
  ], ["server"]);
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:thumbnails");
  api.addFiles("thumbnails-tests.js");
});
