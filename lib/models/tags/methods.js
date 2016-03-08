var match = {
  name: String,
  definition: String,
  //implications: String
};

Meteor.methods({
	addTag: function (data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.toLowerCase().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne({ name: name })) {
      throw new Meteor.Error("tag-name-exists");
    }

    Tags.insert(
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: name,
        definition: data.definition,
        //implications: parseTagStr(data.implications)
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

    // If the name is changed, stuff has to happen...

    Tags.update(
      { _id: tagId },
      { $set: {
        updatedAt: new Date(),
        name: name,
        definition: data.definition,
        //implications: parseTagStr(data.implications)
      } }
    );
  }
});
