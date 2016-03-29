import GeoPattern from "geopattern";
import tinycolor from "tinycolor2";

import globalEvents from "/lib/globalEvents";

setPattern = function (str) {
  const pattern = GeoPattern.generate(str);
  const color = tinycolor(pattern.color);

  globalEvents.emit("patternChange", {
    bg: pattern.toDataUrl(),
    color: color.desaturate(5).darken(15)
  });
};
