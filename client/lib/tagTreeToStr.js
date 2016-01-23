var tagFromElem = function (elem) {
  return elem.text().trim().replace(/\s+/g, " ");
};

tagTreeToStr = function (template) {
  var str = "";

  var tree = template.$(".tagTree");
  var subTrees = tree.find("ul > li > .root");
  subTrees.each(function () {
    var subTree = $(this);

    var first = true;

    var rootNoun = subTree.children(".noun:not(.addRootNoun)");
    var rootNounText = tagFromElem(rootNoun);

    if (rootNounText) {
      var rootAdjectives = subTree.children(".adj:not(.addAdj)");

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

        var noun = descriptor.children(".noun:not(.addNoun)");
        var nounText = tagFromElem(noun);

        if (nounText) {
          var adjectives = descriptor.children(".adj:not(.addAdj)");

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

      str += ";";
    }
  });

  // Remove this after increasing parseTagStr's tolerance.
  str = str.trim();
  if (str.slice(-1) === ";") {
    str = slice(str, undefined, -1);
  }

  return str;
};
