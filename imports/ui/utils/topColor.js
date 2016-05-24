import tinycolor from "tinycolor2";

function topColor(c) {
  return tinycolor(c).desaturate(5).darken(15).toHexString();
}

export default topColor;
