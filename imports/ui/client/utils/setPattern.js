function setPattern(seed, color) {
  Session.set("patternSeed", seed);
  Session.set("patternColor", color);
}

export default setPattern;
