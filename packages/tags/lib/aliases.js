aliasSample = "yoko-littner aka yoko, yoko-ritona";

parseAliases = function (str) {
  str = str.trim().toLowerCase();
  var parsed = {};
  var sides = str.split(/\s*aka\s*/);
  parsed.canonical = sides[0].trim();
  parsed.aliases = sides[1].split(/\s*,\s*/);
  return parsed;
};
