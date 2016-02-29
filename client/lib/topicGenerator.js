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
  "So apparently you can't {ACTION} {OBJECT}",
];

var actions = [
  "kill",
  "love",
  "make",
  "fry?frie",
  "bake",
  "smoke",
  "resurrect",
  "transmute",
  "destroy",
  "seduce",
  "analyze",
  "lambast",
  "kiss?kisse",
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
  "dragons",
  "unicorns",
  "politicians",
  "musicians",
  "demons",
  "artists",
  "skaters",
  "actors",
  "losers",
  "cupcakes",
];

generateTopic = function () {
  var phrase = _.sample(phrases);
  var action = _.sample(actions);
  var object = _.sample(objects);

  if (phrase.indexOf("{ACTION}") > -1) {
    if (phrase.indexOf("{ACTION}ed") > -1) {
      // Past tense
      if (action.indexOf("?") > -1) {
        // Irregular verbs
        action = action.split("?")[1];
      }
      if (slice(action, -1) === "e") {
        // Prevent extra e
        action = slice(action, undefined, -1);
      }
    } else if (phrase.indexOf("{ACTION}s") > -1) {
      if (action.indexOf("?") > -1) {
        // Irregular verbs
        action = action.split("?")[1];
      }
    } else {
      if (action.indexOf("?") > -1) {
        action = action.split("?")[0];
      }
    }
    phrase = phrase.replace("{ACTION}", action);
  }

  if (phrase.indexOf("{OBJECT}") > -1) {
    phrase = phrase.replace("{OBJECT}", object);
  }

  return phrase;
};
