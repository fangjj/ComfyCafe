var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});

genericImageResize = function (job, inStream, outStream, width, height, callback) {
  gm(inStream).resize(width, height).stream("png", Meteor.bindEnvironment(
    function (err, stdout, stderr) {
      stderr.pipe(process.stderr);
      stdout.pipe(outStream);
    }
  ));
};
