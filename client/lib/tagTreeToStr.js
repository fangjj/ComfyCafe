tagTreeToStr = function (template) {
  var str = "";

  var tree = template.$(".tagTree");
  var subTrees = tree.children("ul").children("li");
  subTrees.each(function () {
    var subTree = $(this);

    var first = true;

    var rootNoun = subTree.children(".noun");
    var rootAdjectives = subTree.children(".adj");

    rootAdjectives.each(function () {
      str += $(this).text() + " ";
    });
    str += rootNoun.text();

    var descriptors = subTree.children("ul").children("li");
    descriptors.each(function () {
      var descriptor = $(this);

      var noun = descriptor.children(".noun");
      var adjectives = descriptor.children(".adj");

      if (first) {
        str += " with ";
        first = false;
      } else {
        str += " and ";
      }
      adjectives.each(function () {
        str += $(this).text() + " ";
      });
      str += noun.text();
    });

    str += ";";
  });

  // Remove this after increasing parseTagStr's tolerance.
  return slice(str, undefined, -1);
};
