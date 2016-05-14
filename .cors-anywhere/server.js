const host = process.env.PORT ? "0.0.0.0" : "127.0.0.1";
const port = process.env.PORT || 8080;

const cors_proxy = require("cors-anywhere");
cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [ "origin", "x-requested-with" ],
  removeHeaders: [ "cookie", "cookie2" ]
}).listen(port, host, function() {
  console.log("Running CORS Anywhere on " + host + ":" + port);
});
