var tagFromElem = function (elem) {
  return elem.text().trim().replace(" ", "-");
};

tagTreeToStr = function (template) {
  var str = "";

  var tree = template.$(".tagTree");
  var subTrees = tree.find("ul > li > .root");
  subTrees.each(function () {
    var subTree = $(this);

    var first = true;

    var rootNoun = subTree.children(".noun");
    var rootNounText = tagFromElem(rootNoun);

    if (rootNounText) {
      var rootAdjectives = subTree.children(".adj:not(.addTag)");

      rootAdjectives.each(function () {
        var rootAdjText = tagFromElem($(this));
        if (rootAdjText) {
          str += rootAdjText + " ";
        }
      });
      str += rootNounText;

      var descriptors = subTree.parent().find("ul > li.descriptor");
      descriptors.each(function () {
        var descriptor = $(this);

        var noun = descriptor.children(".noun");
        var nounText = tagFromElem(noun);

        if (nounText) {
          var adjectives = descriptor.children(".adj:not(.addTag)");

          if (first) {
            str += " with ";
            first = false;
          } else {
            str += " and ";
          }
          adjectives.each(function () {
            var adjText = tagFromElem($(this));
            if (adjText) {
              str += adjText + " ";
            }
          });
          str += nounText;
        }
      });
    }

    str += ";";
  });

  // Remove this after increasing parseTagStr's tolerance.
  return slice(str, undefined, -1);
};
