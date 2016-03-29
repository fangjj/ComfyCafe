Package.describe({
  name: "comfysoft:utility",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal utility function package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Npm.depends({
  "lodash": "4.6.1"
});

Package.onUse(function(api) {
  api.versionsFrom("1.3");

  api.use("ecmascript");

  api.use([
    "ongoworks:security"
  ], "server");

  api.addFiles([
    "lib/lodash.js",
    "lib/expr.js",
    "lib/isOwner.js",
    "lib/pushApply.js",
    "lib/jsonClone.js",
    "lib/whiteSplit.js",
    "lib/commaSplit.js",
    "lib/prettyPrint.js",
    "lib/setTitle.js",
    "lib/pushState.js",
    "lib/getQueryParam.js",
    "lib/setQueryParam.js",
    "lib/slice.js",
    "lib/arrayPercent.js",
    "lib/arrayMerge.js",
    "lib/fancySplit.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js"
  ], "server");

  api.export([
    "_",
    "expr",
    "isOwner",
    "pushApply",
    "jsonClone",
    "whiteSplit",
    "commaSplit",
    "prettyPrint",
    "setTitle",
    "pushState",
    "getQueryParam",
    "setQueryParam",
    "setQueryParams",
    "slice",
    "arrayPercent",
    "arrayMerge",
    "fancySplit"
  ], ["client", "server"]);

  api.export([
    "ifOwner"
  ], "server");
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("comfysoft:utility");
  api.addFiles("common-tests.js");
});
