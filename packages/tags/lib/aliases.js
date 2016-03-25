tagAliasSample = "yoko-littner aka yoko, yoko-ritona";

tagParseAliases = function (str) {
  str = str.trim().toLowerCase();
  var parsed = {};
  var sides = str.split(/\s*aka\s*/);
  parsed.canonical = sides[0].trim();
  parsed.aliases = commaSplit(sides[1]);
  return parsed;
};