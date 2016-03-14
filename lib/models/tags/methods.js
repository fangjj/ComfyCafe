var match = {
  name: String,
  type: String,
  definition: String,
  aliases: String,
  origin: String,
  implications: String
};

var aliasParser = function (str) {
  return str.trim().toLowerCase().split(/\s*,\s*/);
};

var implicationParser = function (name, str) {
  return tagParser(name + ":" + str);
};

Meteor.methods({
	addTag: function (data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.trim().toLowerCase().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne({ name: name })) {
      throw new Meteor.Error("tag-name-exists");
    }

    Tags.insert(
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: name,
        type: data.type,
        definition: data.definition,
        aliases: aliasParser(data.aliases),
        aliasStr: data.aliases,
        origin: data.origin,
        implications: implicationParser(name, data.implications),
        implicationStr: data.implications
      }
    );
  },
	updateTag: function (tagId, data) {
    check(tagId, String);
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.toLowerCase().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne(
      {
        _id: { $ne: tagId },
        name: name
      }
    )) {
      throw new Meteor.Error("tag-name-exists");
    }

    var tag = Tags.findOne({ _id: tagId });

    // If the name is changed, stuff has to happen...

    var implications = implicationParser(name, data.implications);
    var diff = tagDiffer(tag.implications, implications);
    prettyPrint(diff);

    Tags.update(
      { _id: tagId },
      { $set: {
        updatedAt: new Date(),
        name: name,
        type: data.type,
        definition: data.definition,
        aliases: aliasParser(data.aliases),
        aliasStr: data.aliases,
        origin: data.origin,
        implications: implications,
        implicationStr: data.implications
      }, $push: { history: tag } }
    );
  }
});
