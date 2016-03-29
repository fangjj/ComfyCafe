import tinycolor from "tinycolor2";

import globalEvents from "/lib/globalEvents";

setPattern = function (seed) {
  return;
  console.log("setPattern", seed);
  globalEvents.emit("patternChange", seed);
};

setTopColor = function (rawColor) {
  const color = tinycolor(rawColor);
  globalEvents.emit("topColorChange", color.desaturate(5).darken(15));
};
