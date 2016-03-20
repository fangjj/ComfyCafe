Package.describe({
  name: "teru:utility",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Internal utility function package for ComfyCafé.",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");

  api.use("ecmascript");

  api.use([
    "ongoworks:security"
  ], "server");

  api.addFiles([
    "lib/jsonClone.js",
    "lib/whiteSplit.js",
    "lib/commaSplit.js",
    "lib/prettyPrint.js",
    "lib/setTitle.js",
    "lib/pushState.js",
    "lib/getQueryParam.js",
    "lib/setQueryParam.js",
    "lib/slice.js",
    "lib/arrayDiffer.js"
  ], ["client", "server"]);

  api.addFiles([
    "server/security.js"
  ], "server");

  api.export([
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
    "arrayDiffer"
  ], ["client", "server"]);

  api.export([
    "ifOwner"
  ], "server");
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("teru:utility");
  api.addFiles("common-tests.js");
});
