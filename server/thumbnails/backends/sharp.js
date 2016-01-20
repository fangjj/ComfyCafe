var sharp = Meteor.npmRequire("sharp");

sharpImageResize = function (inStream, outStream, width, height) {
  var thumb = sharp().resize(width, height).max().toFormat("png");
  inStream.pipe(thumb).pipe(outStream);
};
