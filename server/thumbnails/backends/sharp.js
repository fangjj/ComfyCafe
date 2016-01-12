var sharp = Meteor.npmRequire("sharp");

sharpImageResize = function (inStream, outStream, width, height) {
  var thumb = sharp().resize(width, height).pipe(outStream);
  inStream.pipe(thumb);
};
