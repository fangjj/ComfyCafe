var phrases = [
  "How to {ACTION} {OBJECT}",
  "How do I {ACTION} {OBJECT}?",
  "What do I do if my girlfriend {ACTION}s {OBJECT}?",
  "My boyfriend accidentally {ACTION}ed {OBJECT}",
  "I think I want to {ACTION} {OBJECT}",
  "Today I realized I could {ACTION} {OBJECT}",
  "Why do people like to {ACTION} {OBJECT}?",
  "Why does no one ever {ACTION} {OBJECT}?",
  "Recipes for {OBJECT}",
  "I lost my {OBJECT}",
  "How do I convince people to {ACTION} {OBJECT}?",
  "Where can you find {OBJECT}?",
  "Why don't I have any {OBJECT}?",
];

var actions = [
  "kill",
  "love",
  "make",
  "fry",
  "bake",
  "smoke",
  "resurrect",
  "transmute",
  "destroy",
  "seduce",
  "analyze",
  "lambast"
];

var objects = [
  "humans",
  "friends",
  "dandelions",
  "girls",
  "boys",
  "lettuce",
  "cucumbers",
  "wizards",
  "skeletons",
  "ogres",
  "gnomes",
  "unicorns",
  "politicians",
  "musicians",
  "demons",
  "artists",
  "skaters",
  "actors",
  "losers"
];

generateTopic = function () {
  var phrase = _.sample(phrases);
  var action = _.sample(actions);
  var object = _.sample(objects);
  phrase = phrase.replace("{ACTION}", action);
  if (slice(action, -1) == "e") {
    // Prevent extra e in past tense
    phrase = phrase.replace(action + "ed", action + "d");
  }
  phrase = phrase.replace("{OBJECT}", object);
  return phrase;
};
