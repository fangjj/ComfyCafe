//const gm = require("gm").subClass({ imageMagick: true });
import gm from "gm";
const im = gm.subClass({ imageMagick: true });

export default function (inStream, outStream, width, height) {
  im(inStream).resize(width, height).stream(Meteor.bindEnvironment(
    function (err, stdout, stderr) {
      stderr.pipe(process.stderr);
      stdout.pipe(outStream);
    }
  ));
};
