var sharp = Meteor.npmRequire("sharp");

sharpImageResize = function (inStream, outStream, width, height) {
  var thumb = sharp().resize(width, height).max();
  inStream.pipe(thumb).pipe(outStream);
};
