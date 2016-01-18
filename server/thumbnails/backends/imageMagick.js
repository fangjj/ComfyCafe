var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});

magickImageResize = function (inStream, outStream, width, height) {
  gm(inStream).resize(width, height).stream(Meteor.bindEnvironment(
    function (err, stdout, stderr) {
      stderr.pipe(process.stderr);
      stdout.pipe(outStream);
    }
  ));
};
