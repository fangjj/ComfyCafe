if (process.env.NODE_ENV === "development") {
  Perf = require("react-addons-perf");
}

// Startup
import "/imports/startup/client/startup";
import "/imports/startup/routes";
