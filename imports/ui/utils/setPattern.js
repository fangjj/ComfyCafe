function setPattern(seed, color) {
  console.log(seed, color);
  Session.set("patternSeed", seed);
  Session.set("patternColor", color);
  console.log(Session);
}

export default setPattern;
