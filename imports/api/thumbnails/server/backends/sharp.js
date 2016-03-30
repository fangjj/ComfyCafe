//import { sharp } from "meteor/comfysoft:sharp";

export default function (inStream, outStream, width, height) {
  const thumb = sharp().resize(width, height).max().toFormat("png");
  inStream.pipe(thumb).pipe(outStream);
};
